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
  merged?: { name: string; description: string }[];
  primaryKey: { columnName: string }[];
  columns: {
    name: string;
    type: string;
    mergedFrom?: string;
  }[];
  pkOnly?: boolean;
  discoveredMappings?: Relationship[];
  discoveredForeignKeys?: {
    source: string;
    target: string;
    joinKey: { source: string; target: string };
  }[];
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
    const memberToStartCount = _(Array.from(set)).groupBy((m) => m.split("_")[0]).flatMap((vs, _k) => vs.map(v => [v, vs.length])).fromPairs().value();
    const members = _.sortBy(Array.from(set), [(m) => -memberToStartCount[m], (m) => m.split("_").length, (m) => (""+m).length, identity]);
    return [members[0], members.slice(1)];
  }).filter(([_k, v]) => v.length > 0).fromPairs().value();

  console.error("MS", ret);
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
      if (tableA === tableB) {
        continue;
      }
      const namesMatch = normalizeTableName(tableA) === normalizeTableName(tableB);
      if ( schemas[tableA].primaryKey.length === schemas[tableB].primaryKey.length && 
          ( namesMatch || 
          (JSON.stringify(schemas[tableA].primaryKey) === JSON.stringify(schemas[tableB].primaryKey) && tables[tableA].length === tables[tableB].length))
          ) {

        if (!namesMatch && schemas[tableA].primaryKey.some(k => k.columnName.match("LINE"))) {
          // review counts of unique values and ensure all are >2
          const allCounts = schemas[tableA].primaryKey.map((pk) => {
            const values = new Set(tables[tableA].map((row) => row[pk.columnName]));
            return values.size;
          });

         if (allCounts.some((c) => c < 3)){
            // not enouhg evidence to do line-based matching if we never have more than one line
            continue;
          }
         }
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
      if ((true || nameSegmentPrefixes(tableA, tableB) || tables[tableB].length > 1) && isValidPrefixRelationship(tables, schemas, tableA, tableB, fudgeFactor)) {
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

const equivalentNames = {
  "ACCT": /ACCOUNT/,
  "TX": /TRANSACTIONS?/
}
function nameSegmentPrefixes(tableA: string, tableB: string): boolean {
  const segmentsA = tableA.split("_");
  const segmentsB = tableB.split("_");

  if (segmentsA.slice(0, 3).join("_") === segmentsB.slice(0, 3).join("_")) {
    return true;
  }

  if (segmentsA.length > segmentsB.length) {
    return false;
  } 

  for (let i = 0; i < segmentsA.length; i++) {
    if (segmentsA[i] === segmentsB[i]) {
      continue;
    } else if (equivalentNames[segmentsA[i]] && equivalentNames[segmentsA[i]].test(segmentsB[i])) {
      continue
    } else if (equivalentNames[segmentsB[i]] && equivalentNames[segmentsB[i]].test(segmentsB[i])) {
      continue
    }
    // check if B's letters occur in order in A (e.g., ACCOUNT and ACCT_ADDR work because ACCT occurs in ACCounT)
    for (let j = 0; j < segmentsB[i].length; j++) {
      if (!segmentsA[i].includes(segmentsB[i][j])) {
        return false;
      }
    }
  }

  return true;
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

  // console.log("IPR", tableA, tableB, pkA, pkB)
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
  const aRequired = [...valuesA].filter((v, i) => valuesB.has(v)).length

  if (concordance < 1 - fudgeFactor) {
    return false;
  }

  if (concordance < 1) {
    console.warn(`Low concordance between ${tableA} and ${tableB}: ${concordance}`);
  }

  return true;
}

function findForeignKeyRelationships(
  tables: TablesMap,
  schemas: SchemasMap,
  fudgeFactor: number
): Exclude<Schema["discoveredForeignKeys"], undefined> {
  const relationships: Schema["discoveredForeignKeys"] = [];

  for (const tableA of Object.keys(schemas)) {
    for (const columnA of schemas[tableA].columns) {
      if (columnA.name.match(/(_ID|_GUID|_PTR|_USER|_SOURCE|_LOC|HX)$/)) {
        if (schemas[tableA].discoveredMappings?.some((m) => m.type === "has-parent-table" && m.joinKeys.some((k) => k.source === columnA.name))) {
          continue;
        }

        for (const tableB of Object.keys(schemas)) {
          if (tableA === tableB) {
            continue;
          }
          if (schemas[tableB].primaryKey.length === 1) {
           const pkB = schemas[tableB].primaryKey[0].columnName;
            const valuesA = new Set(tables[tableA].map((row) => row[columnA.name]).filter(identity));
            const valuesB = new Set(tables[tableB].map((row) => row[pkB]));

            const concordance = [...valuesA].filter((v) => valuesB.has(v)).length / valuesA.size;
            // if (tableA === "PROB_LIST_REV_HX" && columnA.name === "PROB_LIST_REV_CSNHX" && tableB === "PAT_ENC") {
            //   console.log("problem list hx", concordance, [...valuesA].filter(identity))
            // }
 
            if (concordance >= 1 - fudgeFactor) {
              relationships.push({
                source: tableA,
                target: tableB,
                joinKey: {source: columnA.name, target: pkB},
              });
            }
          }
        }
      }
    }
  }


  let filteredRelationships = _(relationships).groupBy((r) => r.source + '.' + r.joinKey.source).map((rs, source) => {
    return rs.reduce((best, current) => {
      const sourceTable = source.split(".")[0];
      const bestSegments = best.target.split("_").length;
      const currentSegments = current.target.split("_").length;
      return currentSegments < bestSegments ? current : 
        commonPrefixLength(current.target, sourceTable) > commonPrefixLength(best.target, sourceTable) ? current : best;
    })
  }).value();

  return filteredRelationships;
}

  function commonPrefixLength(a, b){
    // compute common prefix with table for up to min table.length, s.length
    let i = 0;
    for (i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) {
        break;
      }
    }
    return i
  }


function pickBestParent(table: string, parentRelationships: Relationship[], mergedSchemas: SchemasMap): Relationship | null {

  const parentTables = parentRelationships
    .filter((r) => r.target === table)
    .map((r) => r.source);

  // if (table === "HNO_PLAIN_TEXT")
  // console.log("PPP table", table, "parentRelationships", parentTables)

  if (parentTables.length < 1) {
    return null;
  }

  const preferredParents = ["ORDER_PROC"]

  const orderedParents = _(parentTables).sortBy(
    t => preferredParents.includes(t) ? 0 : 1,
    // prefer the parent to be one shorter, rather than 2+ shorter...
    t => mergedSchemas[table].primaryKey.length - mergedSchemas[t].primaryKey.length,
    t => t.split("_").length,
    t => -1 * commonPrefixLength(t, table)
  ).value();

  const bestParent = orderedParents[0];
  if (parentTables.length > 1)
  console.error("Best Parent for ", table, " *by heuristic* is", bestParent, parentTables)
  return parentRelationships.find((r) => r.source === bestParent && r.target === table) || null;
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

    for (const table of Object.keys(mergedSchemas)) {
      const bestParent = pickBestParent(table, parentRelationships, mergedSchemas);

      if (bestParent) {
        mergedSchemas[bestParent.source].discoveredMappings = mergedSchemas[bestParent.source].discoveredMappings || [];
        mergedSchemas[bestParent.source].discoveredMappings!.push(bestParent);

        mergedSchemas[table].discoveredMappings = mergedSchemas[table].discoveredMappings || [];
        mergedSchemas[table].discoveredMappings!.push({
          type: "has-parent-table",
          source: table,
          target: bestParent.source,
          joinKeys: bestParent.joinKeys.map((k) => ({ source: k.target, target: k.source })),
        });
      }
    }


    const foreignKeyRelationships = findForeignKeyRelationships(mergedTables, mergedSchemas, fudgeFactor);
    for (const fk of foreignKeyRelationships) {
      mergedSchemas[fk.source].discoveredForeignKeys = mergedSchemas[fk.source].discoveredForeignKeys || [];
      mergedSchemas[fk.source].discoveredForeignKeys!.push(fk);
    }

    Object.entries(mergedSchemas).forEach(([tableName, schema]) => {
      mergedTables[tableName] = _.sortBy(mergedTables[tableName], ...schema.primaryKey.map((pk) => r => r[pk.columnName] ));
      // console.log("T", tableName, mergedTables[tableName].length, mergedTables[tableName].slice(0, 3))
    })

    console.log(JSON.stringify({
      $meta: { schemas: mergedSchemas },
      ...mergedTables
    }, null, 2));

}

main();

// Improvement ideas
// * Discover "A has at most one optional B" relationships
// * Discover "A.[code] is a foreign key to B.[solePk]" relationships
// * Evaluate normalize(A) is a prefix of normalize(B) tables for missing relationships
// * Add a hotfix file for manual corrections
