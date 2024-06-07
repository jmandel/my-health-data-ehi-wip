import _  from 'lodash';
import { generateInterfaces } from "./codegen";
import client, {Store} from './client';

interface ExpandTablesPolicy {
  parents: boolean, children: boolean, foreign: "pk" | "all", relatedTables: "heuristic" | "none"
}
export function expandTableSet(store: Store, inputTables: string[], expandTablesPolicy: ExpandTablesPolicy = {parents: true, children: false, foreign: "pk", relatedTables: "heuristic"},): string[] {
    let expandedTables = [...inputTables];
    for (const t of inputTables) {
      const pks = store.$meta.schemas[t].primaryKey.map((pk) => pk.columnName);
      for (const m of store.$meta.schemas[t].discoveredMappings || []) {
        if (m.type === "has-parent-table") {
          if (expandTablesPolicy?.parents) {
            expandedTables.push(m.target);
          }
        }
      }
      for (const f of store.$meta.schemas[t].discoveredForeignKeys || []) {
        if (pks.includes(f.joinKey.source) && expandTablesPolicy?.foreign === "pk" || expandTablesPolicy?.foreign === "all") {
          expandedTables.push(f.target);
        }
      }
    }

    const getJoinTargets = (table, schemas) => {
      const schema = schemas.find((s) => s.name === table);
      return [
        ...(schema.discoveredMappings || []),
        ...(schema.discoveredForeignKeys || []),
      ].map((fk) => fk.target).filter(t => !expandedTables.includes(t));
    };

    let schemasToCheck = JSON.parse(JSON.stringify(expandedTables));

    if (expandTablesPolicy.relatedTables === "heuristic") {
      while (schemasToCheck.length > 0) {
        const currentTable = schemasToCheck.pop();
        const joinTargets = getJoinTargets(
          currentTable,
          Object.values(store.$meta.schemas)
        );
        joinTargets.forEach((target) => {
        const numInputTablesUsing = inputTables.filter((t) =>
              getJoinTargets(t, Object.values(store.$meta.schemas)).includes(
                target
              )
            ).length;

          if (
            !expandedTables.includes(target) &&
            numInputTablesUsing >= Math.max(inputTables.length / 2.0, 2)
            || (numInputTablesUsing > 0 && store.$meta.schemas[target].columns.length < 5)
          ) {
            expandedTables.push(target);
            schemasToCheck.push(target);
          }
        });
      }
    }
    // console.log("Expanded")

    return expandedTables;
  };


export function processTables(inputTables: string[], schema: Store, {sampleSize = 5, includeAllForeignKeys = false, expandTables = true, expandTablesPolicy = {parents: true, children: false, foreign: "heuristic"}} = {}) {
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
            includeAllForeignKeys || expandedTables.includes(k.target)
          )
        : undefined,
      discoveredForeignKeys: schema.discoveredForeignKeys
        ? schema.discoveredForeignKeys
            .filter(
              (k) => includeAllForeignKeys || expandedTables.includes(k.target)
            )
        : undefined,
    };
  };


  const filterSchemas = (data, initialTables, expandedTables) => {
    return Object.entries(data.$meta.schemas)
      .filter(([tableName]) => expandedTables.includes(tableName))
      .map(([_tableName, schema]) => {
        return simplifySchema(schema, initialTables, expandedTables);
      });
  };

  const sampleRows = (tableNames, rowData, filteredSchemas) => {
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

      // console.log("SR", tableName, selectedRows.length)
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


  const simplifyData = (data: Store, inputTables: string[]) => {
    const expandedTables = expandTables || expandTablesPolicy ? expandTableSet(data, inputTables, expandTablesPolicy) : inputTables;
    // console.log("Input ", inputTables, expandedTables)
    // console.log("Expanded ", inputTables, expandedTables)
    const filteredSchemas = filterSchemas(data, inputTables, expandedTables);
    // console.log("filteredSchemas ", filteredSchemas )
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


interface ProcessTablesConfig {
  sampleSize?: number,
  includeAllForeignKeys?: boolean,
  expandTables?: boolean,
  expandTablesPolicy?: ExpandTablesPolicy
}
export function processTablesToString(inputTables: string[], schema: Store, {sampleSize = 5, includeAllForeignKeys = false, expandTables = true, expandTablesPolicy = undefined}: ProcessTablesConfig = {}) {
  const output = processTables(inputTables, schema, {sampleSize, includeAllForeignKeys, expandTables, expandTablesPolicy});
  let ret = "";
  ret += output.tsInterfaces;
  for (const [tableName, rows] of Object.entries(output.serializedRows)) {
    ret += `// Sampled ${tableName}s`;
    for (const row of rows as any) {
      ret += "\n" + JSON.stringify(client({$meta: { type: tableName }, ...row, }, undefined, output.surface).toLLMJSON(output.surface), null, "\n").replaceAll(/\n+/g, "\n");
    }

  }
  return ret
}