import _, { identity, merge } from 'lodash';
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";

interface Relationship {
  type: "same-logical-table" | "has-child-table" | "has-parent-table";
  source: string;
  target: string;
  joinKeys: { source: string; target: string }[];
}
interface Table {
  [columnName: string]: string | number | boolean;
  $meta?: any;
}


interface Schema {
  name: string;
  description?: string;
  merged?: {name: string, description: string}[]
  primaryKey: { columnName: string }[];
  columns: {
    name: string;
    type: string;
    mergedFrom?: string;
  }[];
  pkOnly?: boolean;
  discoveredMappings?: Relationship[];
}

interface TablesMap {
  [tableName: string]: Table[];
}

interface SchemasMap {
  [tableName: string]: Schema;
}

interface MergeResult {
  mergedTables: TablesMap;
  mergedSchemas: SchemasMap;
}

function buildMergeableSets(relationships: Relationship[]): { [key: string]: string } {
  const mapping: { [key: string]: Set<string> } = {};

  const sortedRelationships = _.sortBy(
    relationships.filter((r) => r.type === 'same-logical-table'),
    (r) => [r.source.length, r.source]
  );

  for (const relationship of sortedRelationships) {
    const { source, target } = relationship;
    const set = mapping[source] || mapping[target] || new Set();
    set.add(source);
    set.add(target);
    mapping[source] = set;
    mapping[target] = set;
  }

  const ret = _.chain(mapping).values().uniq().map((set) => {
    const members = _.sortBy(Array.from(set), [(m) => (""+m).length, identity]);
    return [members[0], members.slice(1)];
  }).filter(([_k, v]) => v.length > 0).fromPairs().value();

  return ret;
}

function mergeTables(
  tables: TablesMap,
  schemas: SchemasMap,
  relationships: Relationship[]
): MergeResult {
  const mergeMapping = buildMergeableSets(relationships);
  const mergedTables: TablesMap = {};
  const mergedSchemas: SchemasMap = {};

  const nonmergedTables = Object.keys(tables).filter((t) => !mergeMapping[t]);
  for (const baseTable of nonmergedTables.concat(Object.keys(mergeMapping))) {
    if (baseTable === "$meta") {
      continue;
    }

   if (!mergeTables[baseTable]) {
      mergedTables[baseTable] = [...tables[baseTable]];
      mergedSchemas[baseTable] = { ...schemas[baseTable] };
    }

    if (!mergeMapping[baseTable]) {
      continue;
    }

    for (const table of mergeMapping[baseTable]) {
      const primaryKeyToMerge = schemas[table].primaryKey.map((pk) => pk.columnName);
      const basePrimaryKey = schemas[baseTable].primaryKey.map((pk) => pk.columnName);

      const thisTable: TablesMap[string] = JSON.parse(JSON.stringify(mergedTables[baseTable]));
      const thisSchema: SchemasMap[string]  = JSON.parse(JSON.stringify(mergedSchemas[baseTable]));
      try {
        for (const rowToMerge of tables[table]) {
          const baseRow = thisTable.find((row) =>
            basePrimaryKey.every(
              (pk, index) => row[pk] === rowToMerge[primaryKeyToMerge[index]]
            )
          );

          if (baseRow) {
            baseRow[`// mergedFrom ${table}`] = true
            for (const [columnName, columnValue] of Object.entries(rowToMerge)) {
              if (columnName === "$meta") {
                baseRow["$meta"].mergedFrom = baseRow["$meta"].mergedFrom || [];
                baseRow["$meta"].mergedFrom.push(table);
                continue;
              }
              if (columnName in baseRow && baseRow[columnName] !== columnValue) {
                throw new Error(
                  `Conflicting values for column "${columnName}" in tables "${table}" and "${baseTable}"`
                );
              }
              baseRow[columnName] = columnValue;
            }
          } else {
            throw new Error("No base table found for row " + basePrimaryKey)
          }
        }
        thisSchema.merged = thisSchema.merged || [];
        thisSchema.merged.push({name: table, description: schemas[table].description!});
        thisSchema.columns = [
          ...thisSchema.columns,
          ...schemas[table].columns.filter(
            (column) => !thisSchema.columns.some((c) => c.name === column.name)
          ).map(c => ({...c, mergedFrom: table})),
        ];

        delete mergedTables[table];
        delete mergedSchemas[table];

        mergedTables[baseTable] = thisTable;
        mergedSchemas[baseTable] = thisSchema;

      } catch (error) {
        console.error(`Error merging tables "${table}" and "${baseTable}":`, error.message, error.stack);
        mergedTables[table] = tables[table];
        mergedSchemas[table] = schemas[table];
      }
    }
  }

  return { mergedTables, mergedSchemas };
}

function normalizeTableName(tableName: string): string {
  return tableName.replace(/[_\d]/g, "").toLowerCase();
}

function findSameLogicalTableRelationships(tables, schemas: SchemasMap): Relationship[] {
  const relationships: Relationship[] = [];

  for (const tableA of Object.keys(schemas)) {
    for (const tableB of Object.keys(schemas)) {
      if ( schemas[tableA].primaryKey.length === schemas[tableB].primaryKey.length && 
          (normalizeTableName(tableA) === normalizeTableName(tableB) || 
          (!schemas[tableA].primaryKey.some(k => k.columnName.match("LINE")) && JSON.stringify(schemas[tableA].primaryKey) === JSON.stringify(schemas[tableB].primaryKey) && tables[tableA].length === tables[tableB].length))
          ) {
        const joinKeys = schemas[tableA].primaryKey.map((pkA, index) => ({
          source: pkA.columnName,
          target: schemas[tableB].primaryKey[index].columnName,
        }));
        relationships.push({
          type: "same-logical-table",
          source: tableA,
          target: tableB,
          joinKeys,
        });
      }
    }
  }

  return relationships;
}

function findChildTableRelationships(
  tables: TablesMap,
  schemas: SchemasMap,
  fudgeFactor: number
): Relationship[] {
  const relationships: Relationship[] = [];

  for (const tableA of Object.keys(schemas)) {
    for (const tableB of Object.keys(schemas)) {
      if (isValidPrefixRelationship(tables, schemas, tableA, tableB, fudgeFactor)) {
        const joinKeys = schemas[tableA].primaryKey.map((pkA, i) => ({
          source: pkA.columnName,
          target: schemas[tableB].primaryKey[i].columnName,
        }));
        relationships.push({
          type: "has-child-table",
          source: tableA,
          target: tableB,
          joinKeys,
        });
      }
    }
  }

  return relationships;
}

function isValidPrefixRelationship(
  tables: TablesMap,
  schemas: SchemasMap,
  tableA: string,
  tableB: string,
  fudgeFactor: number
): boolean {
  const pkA = schemas[tableA].primaryKey.map((pk) => pk.columnName);
  const pkB = schemas[tableB].primaryKey.map((pk) => pk.columnName);

  if (pkA.length >= pkB.length) {
    return false;
  }

  for (let i = 0; i < pkA.length; i++) {
    const colA = pkA[i];
    const colB = pkB[i];

    if (schemas[tableA].columns.find((c) => c.name === colA)?.type !==
        schemas[tableB].columns.find((c) => c.name === colB)?.type) {
      return false;
    }
  }

  const valuesA = new Set(
    tables[tableA].map((row) => pkA.map((col) => row[col]).join("|"))
  );
  const valuesB = new Set(
    tables[tableB].map((row) => pkA.map((col) => row[pkB[pkA.indexOf(col)]]).join("|"))
  );

  const concordance = [...valuesB].filter((v) => valuesA.has(v)).length / valuesB.size;
  if (concordance < 1 - fudgeFactor) {
    return false;
  }
  if (concordance < 1) {
    console.warn(`Low concordance between ${tableA} and ${tableB}: ${concordance}`);
  }

  return true;
}
async function main() {
  const argv = yargs(hideBin(process.argv))
    .option("input", {
      alias: "i",
      describe: "Path to the input JSON file",
      demandOption: true,
      default: "ehi.json",
      type: "string",
    })
    .option("fudgeFactor", {
      alias: "f",
      describe: "Fudge factor for value concordance check",
      default: 0.1,
      type: "number",
    })
    .help()
    .alias("help", "h")
    .parse();

  const inputFile = argv.input;
  const fudgeFactor = argv.fudgeFactor;

    const inputData = JSON.parse(fs.readFileSync(inputFile, "utf8"));
    const tables = inputData;
    const schemas = inputData.$meta.schemas;

    const sameLogicalTableRelationships = findSameLogicalTableRelationships(tables, schemas);
    const { mergedTables, mergedSchemas } = mergeTables(
      tables,
      schemas,
      sameLogicalTableRelationships
    );


    const parentRelationships = findChildTableRelationships(mergedTables, mergedSchemas, fudgeFactor);
    for (const p of parentRelationships) {
      mergedSchemas[p.source].discoveredMappings = mergedSchemas[p.source].discoveredMappings || [];
      mergedSchemas[p.source].discoveredMappings!.push(p);

      mergedSchemas[p.target].discoveredMappings = mergedSchemas[p.target].discoveredMappings || [];
      mergedSchemas[p.target].discoveredMappings!.push({
        type: "has-parent-table",
        source: p.target,
        target: p.source,
        joinKeys: p.joinKeys.map((k) => ({ source: k.target, target: k.source })),
      });
    }

    console.log(JSON.stringify({
      $meta: {schemas: mergedSchemas},
      ...mergedTables}, null, 2));

}

main();
