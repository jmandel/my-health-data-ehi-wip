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

interface Schema {
  name: string;
  description: string;
  primaryKey: PrimaryKeyColumn[];
  columns: Column[];
  discoveredMappings?: DiscoveredMapping[];
}

interface Metadata {
  schemas: Record<string, Schema>;
}

interface ChildTableInfo {
  name: string;
  joinKey: string;
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
        childTable => `-- Child table: ${childTable.name} (${childTable.minRows} to ${childTable.maxRows} rows) joined on ${childTable.joinKey}\n`
      );
      description += childTableComments.join('  ');
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
        case 'DATETIME (Attached)': // ??
        case 'DATETIME (Local)': // ??
        case 'DATETIME (UTC)': // ??
        case 'VARCHAR':
          columnType = 'TEXT';
          break;
        default: {
            console.log(`'${column.type}'`, column.type === 'DATETIME (Attached)');
          throw new Error(`Unsupported data type: ${column.type}`);

        }
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
          const foreignKeyConstraint = `, FOREIGN KEY (${foreignKeyColumns.join(', ')}) REFERENCES ${referencedTableName} (${referencedColumns.join(', ')}) -- References ${referencedTableName} table\n`;
          columnDefinitions.push(foreignKeyConstraint);
        }
      }
    }

    // Combine column definitions and close the CREATE TABLE statement
    const tableDefinition = columnDefinitions.join('');
    let createTableQuery = `${createTableStatement}${tableDefinition}\n);\n\n`;

    sqlStatements.push(createTableQuery);
  }

  console.log(sqlStatements.join(''))
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

    result.push(schemaName);
  }

  for (const schemaName in schemas) {
    dfs(schemaName);
  }

  return result.reverse();
}

function createTablesAndInsertData(db: Database, metadata: Metadata, childTableInfo: Record<string, ChildTableInfo[]>,  jsonFiles: string[], inputDir: string) {
  // Create tables based on the meta structures in topological order
  db.transaction(() => {
  const sortedSchemas = topologicalSortSchemas(metadata);
  for (const schemaName of sortedSchemas) {
    const sqliteSchema = generateSqliteSchema({ schemas: { [schemaName]: metadata.schemas[schemaName] } }, childTableInfo);
    console.log(schemaName)
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
            console.log(insertQuery)
            const statement = db.prepare(insertQuery);
            for (const row of rows) {
            //   console.log(JSON.stringify(row))
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
  const childTableInfo: Record<string, ChildTableInfo[]> = {};
  for (const schemaName in allSchemas.schemas) {
    const schema = allSchemas.schemas[schemaName];
    if (schema.discoveredMappings) {
      for (const mapping of schema.discoveredMappings) {
        if (mapping.type === 'has-parent-table') {
          const parentTable = mapping.target;
          const childTable = mapping.source;
          const joinKey = mapping.joinKeys.map(jk => jk.source).join(', ');
          const countQuery = `SELECT min(count) as minCount, MAX(count) as maxCount from (SELECT ${joinKey}, COUNT(*) AS count FROM ${childTable} GROUP BY ${joinKey})`;
          const countResults = memDb.query(countQuery).all();
          console.log(countQuery, countResults)

          if (!childTableInfo[parentTable]) {
            childTableInfo[parentTable] = [];
          }
          for (const result of countResults) {
            childTableInfo[parentTable].push({
              name: childTable,
              joinKey: joinKey,
              minRows: result.minCount,
              maxRows: result.maxCount,
            });
          }
        }
      }
    }
  }

  memDb.close();

  // Create the final on-disk SQLite database
  const db = new Database(outputFile);

  // Insert rows into the corresponding tables in the final database
  createTablesAndInsertData(db, allSchemas, childTableInfo,  jsonFiles, inputDir);

  console.log('SQLite database created successfully.');

  db.close();
//   console.log(childTableInfo)
}

main().catch(console.error);