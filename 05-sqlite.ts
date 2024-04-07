import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Database } from 'bun:sqlite';

interface Column {
  ordinalPosition: number;
  name: string;
  type: string;
  discontinued: boolean;
  description: string;
}

interface PrimaryKeyColumn {
  columnName: string;
  ordinalPosition: number;
}

interface JoinKey {
  source: string;
  target: string;
}

interface DiscoveredMapping {
  type: string;
  source: string;
  target: string;
  joinKeys: JoinKey[];
}

interface DiscoveredForeignKey {
  source: string;
  target: string;
  joinKey: JoinKey;
}

interface Schema {
  name: string;
  description: string;
  primaryKey: PrimaryKeyColumn[];
  columns: Column[];
  discoveredMappings?: DiscoveredMapping[];
  discoveredForeignKeys?: DiscoveredForeignKey[];
}

interface Metadata {
  schemas: Record<string, Schema>;
}

interface ChildTableInfo {
  name: string;
  joinKey: string;
  percentWithChildren: number;
  minRows: number;
  maxRows: number;
}

function generateSqliteSchema(metadata: Metadata, childTableInfo: Record<string, ChildTableInfo[]>): string {
  const sqlStatements: string[] = [];

  for (const schemaName in metadata.schemas) {
    const schema = metadata.schemas[schemaName];

    let description = schema.description.replaceAll("\n", " ");
    // Add comments about child tables and their row count ranges grouped by parent join key
    if (childTableInfo[schemaName]) {
      const childTableComments = childTableInfo[schemaName].map(
        stat => `-- Child table: ${stat.name} with ${stat.percentWithChildren}% parent rows having >=1 child. Range: ${stat.minRows} - ${stat.maxRows}. Joined on ${stat.joinKey}`);
      description += "\n  " + childTableComments.join('\n  ');
    }

    // Generate CREATE TABLE statement
    const createTableStatement = `CREATE TABLE ${schemaName} ( -- ${description}\n`;
    const columnDefinitions: string[] = [];

    for (const column of schema.columns) {
      let columnType = '';
      switch (column.type.trim()) {
        case 'FLOAT':
        case 'NUMERIC':
          columnType = 'NUMERIC';
          break;
        case 'INTEGER':
          columnType = 'INTEGER';
          break;
        case 'DATETIME':
        case 'DATETIME (Attached)':
        case 'DATETIME (Local)':
        case 'DATETIME (UTC)':
        case 'VARCHAR':
          columnType = 'TEXT';
          break;
        default:
          throw new Error(`Unsupported data type: ${column.type}`);
      }

      // Generate column definition
      const columnDefinition = `  ${column.name} ${columnType}, -- ${column.description.replaceAll("\n", "")}\n`;
      columnDefinitions.push(columnDefinition);
    }

    // Generate primary key constraint
    const primaryKeyColumns = schema.primaryKey.map(pk => pk.columnName);
    const primaryKeyConstraint = `  PRIMARY KEY (${primaryKeyColumns.join(', ')}) -- Primary Key`;
    columnDefinitions.push(primaryKeyConstraint);

    // Generate foreign key constraints
    if (schema.discoveredMappings) {
      for (const mapping of schema.discoveredMappings) {
        if (mapping.type === 'has-parent-table') {
          const foreignKeyColumns = mapping.joinKeys.map(jk => jk.source);
          const referencedTableName = mapping.target;
          const referencedColumns = mapping.joinKeys.map(jk => jk.target);
          const foreignKeyConstraint = `, FOREIGN KEY (${foreignKeyColumns.join(', ')}) REFERENCES ${referencedTableName} (${referencedColumns.join(', ')})\n`;
          columnDefinitions.push(foreignKeyConstraint);
        }
      }
    }

    // Generate foreign key constraints for discovered foreign keys
    if (schema.discoveredForeignKeys) {
      for (const foreignKey of schema.discoveredForeignKeys) {
        const foreignKeyColumn = foreignKey.joinKey.source;
        const referencedTableName = foreignKey.target;
        const referencedColumn = foreignKey.joinKey.target;
        const foreignKeyConstraint = `, FOREIGN KEY (${foreignKeyColumn}) REFERENCES ${referencedTableName} (${referencedColumn})\n`;
        columnDefinitions.push(foreignKeyConstraint);
      }
    }

    // Combine column definitions and close the CREATE TABLE statement
    const tableDefinition = columnDefinitions.join('');
    let createTableQuery = `${createTableStatement}${tableDefinition}\n);\n\n`;

    sqlStatements.push(createTableQuery);
  }

  console.log(sqlStatements.join(''));
  return sqlStatements.join('');
}

function topologicalSortSchemas(metadata: Metadata): string[] {
  const schemas = metadata.schemas;
  const visited: Record<string, boolean> = {};
  const result: string[] = [];

  function dfs(schemaName: string) {
    if (visited[schemaName]) return;
    visited[schemaName] = true;

    const schema = schemas[schemaName];
    if (schema.discoveredMappings) {
      for (const mapping of schema.discoveredMappings) {
        if (mapping.type === 'has-parent-table') {
          dfs(mapping.target);
        }
      }
    }
    if (schema.discoveredForeignKeys) {
      for (const foreignKey of schema.discoveredForeignKeys) {
        dfs(foreignKey.target);
      }
    }

    result.push(schemaName);
  }

  for (const schemaName in schemas) {
    dfs(schemaName);
  }

  return result.reverse();
}

function createTablesAndInsertData(db: Database, metadata: Metadata, childTableInfo: Record<string, ChildTableInfo[]>, jsonFiles: string[], inputDir: string) {
  // Create tables based on the meta structures in topological order
  db.transaction(() => {
    const sortedSchemas = topologicalSortSchemas(metadata);
    for (const schemaName of sortedSchemas) {
      const sqliteSchema = generateSqliteSchema({ schemas: { [schemaName]: metadata.schemas[schemaName] } }, childTableInfo);
      console.log(schemaName);
      db.exec(sqliteSchema);
    }

    // Insert rows into the corresponding tables
    for (const file of jsonFiles) {
      const jsonData = JSON.parse(fs.readFileSync(path.join(inputDir, file), 'utf-8'));
      for (const tableName of sortedSchemas) {
        if (jsonData[tableName]) {
          const rows = jsonData[tableName];
          const columns = Object.keys(rows[0]).filter(r => r.match(/^[a-zA-Z]/));
          const placeholders = columns.map(() => '?').join(', ');
          const insertQuery = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
          console.log(insertQuery);
          const statement = db.prepare(insertQuery);
          for (const row of rows) {
            try {
              statement.run(columns.map(c => row[c]));
            } catch (e) {
              console.error(e);
              console.error(`Failed to insert ${tableName} row: ${JSON.stringify(row)}`);
            }
          }
        }
      }
    }
  })();
}

// Gather statistics about child tables, including the percentage of parent rows with at least one child row, and the min/max number of child rows per parent join key
function gatherChildTableStatistics(db, metadata) : Record<string,ChildTableInfo[]> {
  const childTableInfo: Record<string, ChildTableInfo[]> = {};

  for (const schemaName in metadata.schemas) {
    const schema = metadata.schemas[schemaName];
    if (schema.discoveredMappings) {
      for (const mapping of schema.discoveredMappings) {
        if (mapping.type === 'has-parent-table') {
          const parentTable = mapping.target;
          const childTable = mapping.source;
          const joinKeys = mapping.joinKeys.map(jk => `p.${jk.target} = c.${jk.source}`).join(' AND ');

          const statsQuery = `
            SELECT
              COUNT(DISTINCT p.${mapping.joinKeys[0].target}) AS totalParentRows,
              COUNT(DISTINCT c.${mapping.joinKeys[0].source}) AS parentRowsWithChildren,
              MIN(c.rowCount) AS minChildren,
              MAX(c.rowCount) AS maxChildren
            FROM ${parentTable} p
            LEFT JOIN (
              SELECT ${mapping.joinKeys.map(jk => jk.source).join(', ')}, COUNT(*) AS rowCount
              FROM ${childTable}
              GROUP BY ${mapping.joinKeys.map(jk => jk.source).join(', ')}
            ) c ON ${joinKeys}`;

          const statsResult = db.prepare(statsQuery).get();
          const percentWithChildren = statsResult.totalParentRows > 0 ? Math.floor(statsResult.parentRowsWithChildren / statsResult.totalParentRows * 100) : 0;

          if (!childTableInfo[parentTable]) {
            childTableInfo[parentTable] = [];
          }

          childTableInfo[parentTable].push({
            name: childTable,
            joinKey: mapping.joinKeys.map(jk => jk.source).join(', '),
            percentWithChildren: percentWithChildren,
            minRows: statsResult.minChildren,
            maxRows: statsResult.maxChildren
          });
        }
      }
    }
  }

  return childTableInfo;
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      describe: 'Input directory containing JSON files',
      demandOption: true,
      type: 'string',
    })
    .option('output', {
      alias: 'o',
      describe: 'Output SQLite database file',
      demandOption: true,
      type: 'string',
    })
    .help()
    .argv;

  const inputDir = argv.input;
  const outputFile = argv.output;

  // Read JSON files from the input directory
  const jsonFiles = fs.readdirSync(inputDir).filter(file => path.extname(file) === '.json');

  // Collect all schemas from all JSON files
  const allSchemas: Metadata = { schemas: {} };
  for (const file of jsonFiles) {
    const jsonData = JSON.parse(fs.readFileSync(path.join(inputDir, file), 'utf-8'));
    Object.assign(allSchemas.schemas, jsonData.$meta.schemas);
  }

  // Create an in-memory database for gathering statistics
  const memDb = new Database();

  // Create tables and insert data in the in-memory database
  createTablesAndInsertData(memDb, allSchemas, {}, jsonFiles, inputDir);

  // Gather statistics about child tables and their row count ranges grouped by parent join key
  const childTableInfo: Record<string, ChildTableInfo[]> =  gatherChildTableStatistics(memDb, allSchemas);
  memDb.close();

  // Create the final on-disk SQLite database
  const db = new Database(outputFile);

  // Insert rows into the corresponding tables in the final database
  createTablesAndInsertData(db, allSchemas, childTableInfo, jsonFiles, inputDir);

  console.log('SQLite database created successfully.');

  db.close();
}

main().catch(console.error);