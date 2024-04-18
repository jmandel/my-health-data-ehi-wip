import _, { constant, get } from 'lodash';
import * as types from './types';

interface SchemaColumn {
    ordinalPosition: number;
    name: string;
    type: string;
    discontinued: boolean;
    description: string;
    entries?: string[];
    linksTo?: string;
}

interface SchemaTable {
    name: string;
    description: string;
    primaryKey: { columnName: string; ordinalPosition: number }[];
    columns: SchemaColumn[];
    discoveredMappings: {
        type: string;
        source: string;
        target: string;
        joinKeys: { source: string; target: string }[];
    }[];
    discoveredForeignKeys: {
        source: string;
        target: string;
        joinKey: { source: string; target: string };
    }[];
}

interface SchemaMeta {
    schemas: { [key: string]: SchemaTable };
}


export interface Store extends Record<string, any[] | SchemaMeta> {
  '$meta': SchemaMeta;
}

// const store: Store = await Bun.file("ehi-merged.json").json();
import storeUntyped from './ehi-merged.json';
export const store = storeUntyped as Store;

const storeGlobal = store;

export const fetchConfig = {
  accumulateErrors: new Set<string>(),
  throwOnErrors: false,
};

function fetchData(entity: any, property: string, store: Store): any {
    const entityType = entity.$meta.type;
    const schema = store.$meta.schemas[entityType];

    if (!schema) {
        throw new Error(`Schema not found for type: ${entityType}`);
    }

    let targetEntity, propertyName;

    // Handle foreign key references, create proxy for results
    for (const fk of schema?.discoveredForeignKeys || []) {
        propertyName = fk.joinKey.source.split('_').slice(0, -1).join('_').toLowerCase();
        if (propertyName === property) {
            targetEntity = fk.target;
            const results = _.filter(store[targetEntity], item => item[fk.joinKey.target] === entity[fk.joinKey.source]);
            if (results.length > 1) {
                throw `Multiple results found for foreign key reference '${property}' in entity of type '${entityType}`
            }
            if(results.length === 0) {
                return null;
            }
            
            return createProxy(results[0], fetchData, store)
        }
    }

    // Handle discovered mappings for child and parent tables
    for (const mapping of schema?.discoveredMappings || []) {
        propertyName = mapping.target.toLowerCase();
        if (mapping.type === 'has-child-table' && propertyName === property) {
            targetEntity = mapping.target;
            const res =  _.filter(store[targetEntity], item => mapping.joinKeys.every(jk => item[jk.target] === entity[jk.source])).map(item => createProxy(item, fetchData, store));
            res.$meta = {type: targetEntity};
            return res;
        } else if (mapping.type === 'has-parent-table' && propertyName === property) {
            targetEntity = mapping.target;
            const parentItem = _.find(store[targetEntity], item => mapping.joinKeys.every(jk => item[jk.target] === entity[jk.source]));
            return parentItem ? createProxy(parentItem, fetchData, store) : null;
        }
    }

    const props = schema.columns.map(c => c.name)
    if (!props.includes(property)) {
      const propsTruncated = props.length > 15 ? props.join(",").slice(0, 200) + "..." : props.join(",");

      const error =  new Error(`Property '${property}' not found in entity of type '${entityType}'. Availble primitives include: ${propsTruncated}`);
      fetchConfig.accumulateErrors.add(error.message);
      if (fetchConfig.throwOnErrors) {
        throw error
      }

    }
    return null
}
const fetchDataGlobal = fetchData;

export default function createProxy<T extends object>(entity: T, fetchData: Function = fetchDataGlobal, store: Store = storeGlobal): T {
    return new Proxy(entity, {
        get(target, property, receiver) {
            if (property === '__proxy'){
              return true
            }
            if (property === 'toLLMJSON') {
                return (store = storeGlobal) => {
                    return customJSON({store, target: receiver, forLLM: true});
                };
            }
            if (property === 'toJSON') {
                return () => {
                    return customJSON({store, target: receiver});
                };
            }
            if (property in target) {
                return Reflect.get(target, property, receiver);
            } else {
                return fetchData(target, property as string, store);
            }
        }
    }) as T;
}


interface CustomJSONConfig {
  target: any;
  store?: any;
  seenObjects?: Set<string>;
  depth?: number;
  forLLM?: boolean;
}

function customJSON({ target, store, seenObjects = new Set(), depth = 0, forLLM = false }: CustomJSONConfig) {
    if (!target) {
        return target;
    }
    const schema = store.$meta.schemas[target.$meta.type];
    if (!schema) {
        throw new Error(`No schema found for type: ${target.$meta.type}`);
    }

    const uniqueId = `${target.$meta.type}|` + schema.primaryKey.map(pk => target[pk.columnName]).join('|');
    
    if (seenObjects.has(uniqueId)) {
        const idParts = uniqueId.split('|');
        const r = { "serializedEarlierSeeAbove": true, $ref: {type: idParts[0], primaryKey: idParts.slice(1)}};
        return r ;
    }

    seenObjects.add(uniqueId);

    const result = {
        $type: target.$meta.type,
    };

    schema.columns.forEach(column => {
        const value = target[column.name];
        result[column.name] = value;
    });

    schema.discoveredForeignKeys?.forEach(fk => {
        const refName = fk.joinKey.source.split('_').slice(0, -1).join('_').toLowerCase();
        const targetEntity = target[refName]
        if (targetEntity) {
            if (forLLM) {
                result[refName] = {"//note": `embedded ${targetEntity.$meta?.type || ""} omitted for brevity; available in-memory`};
            }
            else if (depth > 0) {
                result[refName] = customJSON({ target: targetEntity, store, seenObjects, depth: depth - 1 });
            }
        }
    });

    schema.discoveredMappings?.forEach(mapping => {
        const propName = mapping.target.toLowerCase();
        if (target[propName] !== undefined) {
            let targetEntity = target[propName];
            if (forLLM) {
                result[propName] = Array.isArray(target[propName]) ? [`//note: embedded ${targetEntity?.$meta.type || ""} omitted for brevity; available in-memory`]:{"//note": `embedded ${targetEntity.$meta?.type || ""} omitted for brevity; available in-memory`};
            }
            else if (depth > 0) {
                if (Array.isArray(targetEntity)){
                    result[propName] = targetEntity.map(child => customJSON({ target: child, store, seenObjects, depth: depth - 1 }));
                } else {
                    result[propName] = customJSON({ target: targetEntity, store, seenObjects, depth: depth - 1 });
                }
            }
        }
    });

    return result;
}

const p: types.PAT_ENC[] = [1,2,3].map((_, i) => createProxy(store.PAT_ENC[i], fetchData, store));
// console.log(JSON.stringify(p, null, 2))

export const db = new Proxy({}, {
  get: function(target, prop, receiver) {
    if (prop in target) {
      return target[prop]
    }
    const schema = store['$meta'].schemas[prop as string];
    if (!schema) {
        throw new Error(`No schema found for type: ${String(prop)}`);
    }
    return (store[prop as string] as any[]).map((item) => createProxy(item, fetchData, store));
  }
});

// export function db (type: Exclude<string,'$meta'>, regex?: RegExp){
//     regex = new RegExp(regex, "i")
//     const schema = store['$meta'].schemas[type];
//     if (!schema) {
//         throw new Error(`No schema found for type: ${type}`);
//     }
//     return (store[type] as any[])?.filter(v => !regex || regex.test(JSON.stringify(v)))?.map((item) => createProxy(item,));
// }
db.ehi = store;
db.errors = fetchConfig.accumulateErrors;

export const storeIndex = buildIndex(store as Store);


interface Index {
  foreignKeys: {
    [tableName: string]: {
      [rowId: string]: {
        [foreignTableName: string]: string[];
      };
    };
  };
  parentChildLinks: {
    [parentTableName: string]: {
      [parentRowId: string]: {
        [childTableName: string]: string[];
      };
    };
  };
  rowsByPrimaryKey: {
    [tableName: string]: {
      [primaryKey: string]: any;
    };
  };
}

function buildIndex(store: typeof store): Index {
  const index: Index = {
    foreignKeys: {},
    parentChildLinks: {},
    rowsByPrimaryKey: {},
  };

  for (const tableName in store.$meta.schemas) {
    const tableSchema = store.$meta.schemas[tableName];
    const tableData = store[tableName];

    for (const row of tableData) {
      const primaryKeyValues = tableSchema.primaryKey.map((pk) => row[pk.columnName]);
      const rowId = primaryKeyValues.join('|');

      // Store the row object by its full primary key
      if (!index.rowsByPrimaryKey[tableName]) {
        index.rowsByPrimaryKey[tableName] = {};
      }
      index.rowsByPrimaryKey[tableName][rowId] = row;

      // Build foreign key index
      for (const foreignKey of tableSchema.discoveredForeignKeys || []) {
        const foreignTableName = foreignKey.target;
        const foreignRowId = row[foreignKey.joinKey.source];

        if (!index.foreignKeys[tableName]) {
          index.foreignKeys[tableName] = {};
        }
        if (!index.foreignKeys[tableName][rowId]) {
          index.foreignKeys[tableName][rowId] = {};
        }
        if (!index.foreignKeys[tableName][rowId][foreignTableName]) {
          index.foreignKeys[tableName][rowId][foreignTableName] = [];
        }
        index.foreignKeys[tableName][rowId][foreignTableName].push(foreignRowId);
      }

      // Build parent-child link index
      for (const mapping of tableSchema.discoveredMappings || []) {
        if (mapping.type === 'has-child-table') {
          const childTableName = mapping.target;
          const childRows = store[childTableName].filter((childRow) =>
            mapping.joinKeys.every(
              ({ source, target }) => childRow[target] === row[source]
            )
          );

          if (!index.parentChildLinks[tableName]) {
            index.parentChildLinks[tableName] = {};
          }
          if (!index.parentChildLinks[tableName][rowId]) {
            index.parentChildLinks[tableName][rowId] = {};
          }
          index.parentChildLinks[tableName][rowId][childTableName] = childRows.map(
            (childRow) => tableSchema.primaryKey.map((pk) => childRow[pk.columnName]).join('|')
          );
        }
      }
    }
  }

  return index;
}