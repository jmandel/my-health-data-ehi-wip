import _, { constant } from 'lodash';
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

interface Store {
    $meta: SchemaMeta;
    [typeName: string]: any[] | SchemaMeta;
}


const store: Store = await Bun.file("ehi-merged.json").json();
const storeGlobal = store;

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
            return _.filter(store[targetEntity], item => mapping.joinKeys.every(jk => item[jk.target] === entity[jk.source])).map(item => createProxy(item, fetchData, store));
        } else if (mapping.type === 'has-parent-table' && propertyName === property) {
            targetEntity = mapping.target;
            const parentItem = _.find(store[targetEntity], item => mapping.joinKeys.every(jk => item[jk.target] === entity[jk.source]));
            return parentItem ? createProxy(parentItem, fetchData, store) : undefined;
        }
    }

    return null
    // throw new Error(`Property '${property}' not found in entity of type '${entityType}'`);
}
const fetchDataGlobal = fetchData;

export default function createProxy<T extends object>(entity: T, fetchData: Function = fetchDataGlobal, store: Store = storeGlobal): T {
    return new Proxy(entity, {
        get(target, property, receiver) {
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

function customJSON({ target, store, seenObjects = new Set(), depth = 1, forLLM = false }: CustomJSONConfig) {
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
        if (depth > 0 && targetEntity) {
            if (forLLM) {
                result[refName] = Array.isArray(targetEntity) ? [`//note: ${targetEntity[0].$meta.type || ""} omitted for brevity; here in-memory`]:{"//note": `${targetEntity.$meta?.type || ""} omitted for brevity; here in-memory`};
            }
            else {
                result[refName] = customJSON({ target: targetEntity, store, seenObjects, depth: depth - 1 });
            }
        }
    });

    schema.discoveredMappings?.forEach(mapping => {
        const propName = mapping.target.toLowerCase();
        if (depth > 0 && target[propName] !== undefined) {
            let targetEntity = target[propName];
            if (forLLM) {
                result[propName] = Array.isArray(target[propName]) ? [`//note: ${targetEntity[0].$meta.type || ""} omitted for brevity; here in-memory`]:{"//note": `${targetEntity.$meta?.type || ""} omitted for brevity; here in-memory`};
            }
            else {
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

// const p: types.PAT_ENC[] = [1,2,3].map((_, i) => createProxy(store.PAT_ENC[i], fetchData, store));
// console.log(JSON.stringify(p, null, 2))
