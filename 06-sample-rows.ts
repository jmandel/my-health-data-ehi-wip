import _ from 'lodash';
import fs from 'fs';
import ehiMerged from "./ehi-merged.json";
import { generateInterfaces } from "./codegen2";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import client from "./client"


export default function processTables(inputTables: string[], schema) {
  inputTables = inputTables.filter(t => schema.$meta.schemas[t]);

  const MAX_COLS_BY_DEFAULT = 20;
  const generics = ["_ID", "_GUID", "_PTR", "_USER", "_SOURCE", "_LOC "];

  const simplifySchema = (schema, initialTables, expandedTables) => {
    const parts = [
      ...new Set(
        expandedTables
          .flatMap((t) => t.split("_"))
          .filter((t) => !generics.includes(t))
      ),
    ];

    const simplifiedColumns = schema.columns
      .filter(
        (c) =>
          initialTables.includes(schema.name) ||
          schema.columns.length <= MAX_COLS_BY_DEFAULT ||
          schema.primaryKey.map((k) => k.columnName).includes(c.name) ||
          c.name.split("_").some((p) => parts.includes(p))
      )
      .map((column) => ({
        ...column,
        description: column.description.split(".")[0].slice(0, 200),
      }));

    return {
      ...schema,
      description: schema.description.split(".")[0].slice(0, 200),
      columns: simplifiedColumns,
      discoveredMappings: schema.discoveredMappings
        ? schema.discoveredMappings.filter((k) =>
            k.joinKeys.length === 1 || expandedTables.includes(k.target)
          )
        : undefined,
      discoveredForeignKeys: schema.discoveredForeignKeys
        ? schema.discoveredForeignKeys
            .map((fk) => ({
              ...fk,
              joinKey: {
                source: fk.joinKey.source,
                target: fk.joinKey.target,
              },
            }))
            .filter(
              (k) =>
                k.joinKey.source && k.joinKey.target && expandedTables.includes(k.target)
            )
        : undefined,
    };
  };

  const expandTableSet = (data, inputTables) => {
    let expandedTables = [...inputTables];
    for (const t of inputTables) {
      const pks = data.$meta.schemas[t].primaryKey.map((pk) => pk.columnName);
      for (const m of data.$meta.schemas[t].discoveredMappings || []) {
        if (m.type === "has-parent-table") {
          expandedTables.push(m.target);
        }
      }
      for (const f of data.$meta.schemas[t].discoveredForeignKeys || []) {
        if (pks.includes(f.joinKey.source)) {
          expandedTables.push(f.target);
        }
      }
    }

    const getJoinTargets = (table, schemas) => {
      const schema = schemas.find((s) => s.name === table);
      return [
        ...(schema.discoveredMappings || []),
        ...(schema.discoveredForeignKeys || []),
      ].map((fk) => fk.target);
    };

    let schemasToCheck = JSON.parse(JSON.stringify(expandedTables));
    while (schemasToCheck.length > 0) {
      const currentTable = schemasToCheck.shift();
      const joinTargets = getJoinTargets(
        currentTable,
        Object.values(data.$meta.schemas)
      );

      joinTargets.forEach((target) => {
        if (
          !expandedTables.includes(target) &&
          inputTables.filter((t) =>
            getJoinTargets(t, Object.values(data.$meta.schemas)).includes(
              target
            )
          ).length >= inputTables.length / 2.0
        ) {
          expandedTables.push(target);
          schemasToCheck.push(target);
        }
      });
    }

    return expandedTables;
  };


  const filterSchemas = (data, initialTables, expandedTables) => {
    return Object.entries(data.$meta.schemas)
      .filter(([tableName]) => expandedTables.includes(tableName))
      .map(([tableName, schema]) => {
        return simplifySchema(schema, initialTables, expandedTables);
      });
  };

  const sampleRows = (tableNames, rowData, filteredSchemas) => {
    const sampleSize = 5;
    const sampledRows = {};

    tableNames.forEach((tableName, index) => {
      const tableRows = rowData[tableName] || [];
      const schema = filteredSchemas.find(
        (schema) => schema.name === tableName
      );
      const foreignKeys = (schema.discoveredForeignKeys || []).map((fk) => ({...fk, joinKeys: [fk.joinKey]})).concat(schema.discoveredMappings || []);

      let selectedRows = [];

      if (index === 0) {
        // For the first table, select rows with non-empty join keys
        const rowsWithNonEmptyJoinKeys = tableRows.filter((row) =>
          foreignKeys.some((fk) =>
            fk.joinKeys.every((jk) => row[jk.source] !== undefined)
          )
        );

        selectedRows = [
          ...rowsWithNonEmptyJoinKeys,
          ...tableRows.filter((row) => !rowsWithNonEmptyJoinKeys.includes(row)),
        ].slice(0, sampleSize);
      } else {
        // For subsequent tables, maximize the chances of non-empty joins with all previous tables
        const previousTablesRows = tableNames
          .slice(0, index)
          .flatMap((prevTableName) => sampledRows[prevTableName]);

        const rowsWithNonEmptyJoins = tableRows.filter((row) =>
          previousTablesRows.some((prevRow) =>
            foreignKeys.some((fk) =>
              fk.joinKeys.every((jk) => row[jk.source] === prevRow[jk.target])
            )
          )
        );

        selectedRows = [
          ...rowsWithNonEmptyJoins,
          ...tableRows.filter((row) => !rowsWithNonEmptyJoins.includes(row)),
        ].slice(0, sampleSize);
      }

      sampledRows[tableName] = selectedRows.map((o) =>
        _(o)
          .toPairs()
          .filter(([key]) => schema.columns.map((c) => c.name).includes(key))
          .fromPairs()
          .value()
      );
    });

    return sampledRows;
  };


  const simplifyData = (data, inputTables) => {
    const expandedTables = expandTableSet(data, inputTables);
    console.log("Expanded ", inputTables, expandedTables)
    const filteredSchemas = filterSchemas(data, inputTables, expandedTables);
    const candidateRowSubset = sampleRows(
      expandedTables,
      data,
      filteredSchemas
    );

    const tsInterfaces = generateInterfaces(
      filteredSchemas.reduce(
        (obj, schema) => ({ ...obj, [schema.name]: schema }),
        {}
      )
    );

    const serializedRows = Object.entries(candidateRowSubset).reduce(
      (obj, [tableName, rows]) => ({
        ...obj,
        [tableName]: rows,
      }),
      {}
    );

    return {
      surface: {$meta: {schemas: _(filteredSchemas).map(s => [s.name, s]).fromPairs().value()}},
      tsInterfaces,
      serializedRows,
    };
  };

  const output = simplifyData(schema, inputTables);
  return output;
}

if (import.meta.url === `file://${process.argv[1]}`) {
// Runner script using yargs to handle command-line arguments
yargs(hideBin(process.argv))
  .scriptName("generate-ts")
  .usage('$0 --schema <path>')
  .option('schema', {
    describe: 'Path to the JSON schema file',
    type: 'string',
    default: 'ehi-merged.json',
    nargs: 1
  })
  .option('tables', {
    describe: 'Tables to merge',
    type: 'string',
    default: '[]',
    nargs: 1
  })
  .help()
  .alias('help', 'h')
  .parseAsync()
  .then(args => {
    const schemaPath = args.schema;
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const output = processTables(JSON.parse(args.tables), schemaData);
    console.log(output.tsInterfaces);
    for (const [tableName, rows] of Object.entries(output.serializedRows)) {
      console.log(`// Sampled ${tableName}s`);
      for (const row of rows) {
        console.log(JSON.stringify(client({$meta: { type: tableName }, ...row, }).toLLMJSON(output.surface)));
      }

    }
  })
  .catch(error => {
    console.error('Failed to generate TypeScript interfaces:', error);
    process.exit(1);
  });
}