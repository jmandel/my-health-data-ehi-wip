import _ from 'lodash';
import ehiMerged from "./ehi-merged.json";
const data = ehiMerged

export default function processTables(inputTables: string[]){
  inputTables = inputTables.filter(t => data.$meta.schemas[t]);
  // Read the JSON file

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
        name: column.name,
        type: column.type,
        description: column.description.split(".")[0].slice(0, 200),
      }));

    return {
      name: schema.name,
      description: schema.description.split(".")[0].slice(0, 200),
      primaryKey: schema.primaryKey.map((pk) => pk.columnName),
      columns: simplifiedColumns,
      foreignKeys: [
        ...(schema.discoveredMappings || []),
        ...(schema.discoveredForeignKeys || []).map((fk) => ({
          source: fk.source,
          target: fk.target,
          joinKeys: [fk.joinKey],
        })),
      ].filter((k) => k.joinKeys.length === 1 || expandedTables.includes(k.target)),
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
          ).length >= 2
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
        const simplifiedSchema = simplifySchema(
          schema,
          initialTables,
          expandedTables
        );

        // // Filter discovered mappings and foreign keys
        // const filteredMappings = simplifiedSchema.foreignKeys.filter(
        //   (mapping) =>
        //     expandedTables.includes(mapping.source) &&
        //     expandedTables.includes(mapping.target)
        // );


        return simplifiedSchema;
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
      const foreignKeys = schema.foreignKeys;

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
    const filteredSchemas = filterSchemas(data, inputTables, expandedTables);
    const candidateRowSubset = sampleRows(
      expandedTables,
      data,
      filteredSchemas
    );

    return filteredSchemas.reduce(
      (obj, schema) => ({
        ...obj,
        [schema.name]: {
          schema,
          sampleRows: candidateRowSubset[schema.name] || "NONE",
        },
      }),
      {}
    );
  };

  const output = simplifyData(data, inputTables);
  return output;
}