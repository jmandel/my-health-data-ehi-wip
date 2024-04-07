interface ColumnMeta {
  ordinalPosition: number;
  name: string;
  type: string;
  discontinued: boolean;
  description: string;
  entries?: string[];
  mergedFrom?: string;
  linksTo?: string;
}
interface TableMeta {
  name: string;
  description: string;
  primaryKey: PrimaryKeyMeta[];
  columns: ColumnMeta[];
  outgoingLinks?: OutgoingLinkMeta[];
  merged?: {name: string, description: string}[];
  discoveredMappings?: {
    type: string;
    source: string;
    target: string;
    joinKeys: {
      source: string;
      target: string;
    }[];
  }[];
  discoveredForeignKeys?: {
    source: string;
    target: string;
    joinKey: { source: string; target: string };
  }[];
}


interface PrimaryKeyMeta {
  columnName: string;
  ordinalPosition: number;
}

interface OutgoingLinkMeta {
  targetTable: string;
  joinColumns: {
    source: string;
    target: string;
  }[];
  cardinality: 'one' | 'many';
}

interface DatabaseMeta {
  [tableName: string]: TableMeta;
}

function generateTypeScriptCode(databaseMeta: DatabaseMeta, databaseData: any): string {
  const interfaceCode = Object.entries(databaseMeta).map(([tableName, tableMeta]) => `
    /**
     * ${tableMeta.description}
     */
    export interface ${tableName} {
      ${tableMeta.columns.map(column => `
        /**
         * ${column.description}
         */
        ${column.name}: ${getTypeScriptType(column.type)};
      `).join('\n')}
    }
  `).join('\n');

  const outgoingLinks: { [tableName: string]: OutgoingLinkMeta[] } = {};
  Object.entries(databaseMeta).forEach(([tableName, tableMeta]) => {
    outgoingLinks[tableName] = (tableMeta.discoveredMappings || []).map(mapping => ({
      targetTable: mapping.target,
      joinColumns: mapping.joinKeys,
      cardinality: isOne(mapping.joinKeys, databaseMeta[mapping.target].primaryKey) ? 'one' : 'many',
    }));
  });


  const foreignKeyMap = generateForeignKeyMap(databaseMeta);

  const classCode = Object.entries(databaseMeta).map(([tableName, tableMeta]) => `
    class ${tableName}Proxy extends VirtualProxy<'${tableName}'> {
      constructor(data: DatabaseData['${tableName}'][number], model: DatabaseModel) {
        super(data, '${tableName}', model);
      }
      ${outgoingLinks[tableName].map(link => `
        ${link.targetTable.toLowerCase()}(): ${link.cardinality === 'one' ? `${link.targetTable}Proxy` : `VirtualArray<${link.targetTable}Proxy>`} {
          const targetIds = this.model.data.${link.targetTable}
            .filter(item => ${link.joinColumns.map(jc => `item.${jc.target} === this.get('${jc.source}')`).join(' && ')});
          return ${link.cardinality === 'one' ? `new ${link.targetTable}Proxy(targetIds[0], this.model)` : `new VirtualArray(targetIds.map(item => new ${link.targetTable}Proxy(item, this.model)))`};
        }
      `).join('\n')}

    }
  `).join('\n');

  const proxyCode = `
    type ForeignKeyMap = {
      ${Object.entries(foreignKeyMap).map(([tableName, foreignKeys]) => `
        ${tableName}: {
          ${Object.entries(foreignKeys).map(([foreignKey, targetTable]) => `
            ${foreignKey}: '${targetTable}';
          `).join('\n')}
        };
      `).join('\n')}
    };

interface ColumnMeta {
  ordinalPosition: number;
  name: string;
  type: string;
  discontinued: boolean;
  description: string;
  entries?: string[];
  mergedFrom?: string;
  linksTo?: string;
}
interface TableMeta {
  name: string;
  description: string;
  primaryKey: PrimaryKeyMeta[];
  columns: ColumnMeta[];
  outgoingLinks?: OutgoingLinkMeta[];
  merged?: {name: string, description: string}[];
  discoveredMappings?: {
    type: string;
    source: string;
    target: string;
    joinKeys: {
      source: string;
      target: string;
    }[];
  }[];
  discoveredForeignKeys?: {
    source: string;
    target: string;
    joinKey: { source: string; target: string };
  }[];
}


interface PrimaryKeyMeta {
  columnName: string;
  ordinalPosition: number;
}

interface OutgoingLinkMeta {
  targetTable: string;
  joinColumns: {
    source: string;
    target: string;
  }[];
  cardinality: 'one' | 'many';
}

interface DatabaseMeta {
  [tableName: string]: TableMeta;
}


    class VirtualArray<T> extends Array<T> {
      constructor(data: T[]) {
        super(...data);
      }

      query(predicate: (item: T) => boolean): VirtualArray<T> {
        return new VirtualArray(this.filter(predicate));
      }

      last(): T {
        return this[this.length - 1];
      }
    }
    export class VirtualProxy<T extends keyof DatabaseData & keyof ForeignKeyMap> {
    constructor(
        private data: DatabaseData[T][number],
        public readonly tableName: T,
        public model: DatabaseModel
    ) {}
    toJSON(options: ToJSONOptions = {}): any {
        const { depth = 1, expand = {} } = options;
        return this.toJSONHelper(this.data, depth, expand);
    }

    public toJSONHelper(
        data: any,
        depth: number,
        expandOptions: ExpansionOptions,
        stack = []
    ): any {
        // console.log("To JSON", this.tableName, depth, expandOptions);
        if (depth === 0) {
            return this.createMetaObject(data);
        }

        const jsonData: any = {};

        const fks = foreignKeyMap[this.tableName];
        // console.log("Foreign keys", this.tableName, fks);
        for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            const expandOption = expandOptions[key];

            if (
            expandOption &&
            expandOption.filter &&
            !new RegExp(expandOption.filter).test(value)
            ) {
            continue;
            }

            if (fks[key] && value !== null) {
            // console.log("Find remote", key, value);
            const nestedExpand = expandOption && expandOption.expand;
            const nestedDepth =
                expandOption && expandOption.depth !== undefined
                ? expandOption.depth
                : depth - 1;
            const remoteObject = this.getRelated(key as any);
            if (!stack.includes(remoteObject.data) && remoteObject) {

            stack.push(remoteObject.data);
            // console.log("Setting", key, value, nestedDepth, remoteObject.data)
            const shortKey = key.split("_").slice(0,-1).join("_");
            jsonData[shortKey] = remoteObject?.toJSONHelper(
                remoteObject.data,
                nestedDepth,
                nestedExpand || {},
                stack
            );
            // console.log("Set", jsonData[key]);
            jsonData[shortKey][fks[key]] = value
            } else {
                jsonData[key] = value;
            }
            } else {
            jsonData[key] = value;
            }
        }
        }

        return jsonData;
    }


    private createMetaObject(data: any): any {
        // const primaryKey = this.getPrimaryKey();
        const metaObject: any = {
        // [primaryKey]: data[primaryKey],
        $meta: {
            summary: this.getMetaSummary(data),
            nextSteps: this.getNextSteps(data),
        },
        };
        return metaObject;
    }

    private getPrimaryKey(): string {
        // Implementation to get the primary key of the current table
        // You can use the table metadata to determine the primary key
        // For simplicity, assuming the primary key is always named 'id'
        return 'id';
    }

    private getMetaSummary(data: any): string {
        // Implementation to generate a summary based on the data
        // You can customize this based on your requirements
        return ${"`"}Summary for ${"$"}{this.tableName} with ID: ${"$"}{data[this.getPrimaryKey()]}${"`"};
    }

    private getNextSteps(data: any): string {
        // Implementation to generate next steps based on the data
        // You can customize this based on your requirements
        return ${"`"}To expand this ${"$"}{this.tableName} object, use the following options: ...${"`"};
    }

    toText(): string {
        return JSON.stringify(this.data);
    }

    get(key: keyof DatabaseData[T][number]): DatabaseData[T][number][typeof key] {
        return this.data[key];
    }
    getRelated<FK extends keyof ForeignKeyMap[T] & keyof DatabaseData & string>(
        foreignKey: FK,
    ):
        | (ForeignKeyMap[T][FK] extends keyof DatabaseData
            ? VirtualProxy<ForeignKeyMap[T][FK]>
            : null)
        | null {
        const targetTable = foreignKeyMap[this.tableName][foreignKey];

        if (targetTable) {
        const targetId = this.get(foreignKey as any);
        // console.log(this.tableName, this?.model?.[targetTable.toLowerCase()]?.all().length, targetTable, targetId)
        const targetRecord = this.model[targetTable.toLowerCase() as keyof DatabaseData].getById(targetId);
        return targetRecord;
        }

        return null;
    }

}
    
  `;

  const entryPointCode = `
    /**
     * Database model class
     */
    export class DatabaseModel {
      public data: DatabaseData;

      constructor(data: DatabaseData) {
        this.data = data;
      }

      ${Object.keys(databaseMeta).map(tableName => `
        /**
         * Get the ${tableName} table
         */
        get ${tableName.toLowerCase()}() {
          return {
            /**
             * Get all ${tableName} items
             */
            all: () => new VirtualArray(this.data.${tableName}.map(item => new ${tableName}Proxy(item, this))),
            /**
             * Get a ${tableName} item by its primary key
             * @param ${databaseMeta[tableName].primaryKey.map(pk => `${pk.columnName} ${getColumnDescription(pk.columnName, databaseMeta[tableName].columns)}`).join(', ')}
             */
            getById: (${databaseMeta[tableName].primaryKey.map(pk => `${pk.columnName}: ${getTypeScriptType(getColumnType(pk.columnName, databaseMeta[tableName].columns))}`).join(', ')}): ${tableName}Proxy | undefined => {
              const item = this.data.${tableName}.find(item => ${databaseMeta[tableName].primaryKey.map(pk => `item.${pk.columnName} === ${pk.columnName}`).join(' && ')});
              return item ? new ${tableName}Proxy(item, this) : undefined;
            },
          };
        }
      `).join('\n')}
    }
  `;


  return `
    type DatabaseData = {
      ${Object.entries(databaseMeta).map(([tableName, _tableMeta]) => `${tableName}: ${tableName}[];`).join('\n')}
    };

    ${interfaceCode}

    ${proxyCode}

    ${classCode}

    ${entryPointCode}

    const databaseMeta: DatabaseMeta = ${JSON.stringify(databaseMeta, null, 2)};
    const foreignKeyMap: ForeignKeyMap = Object.entries(databaseMeta).reduce((map, [tableName, tableMeta]) => {
        map[tableName] = (tableMeta.discoveredForeignKeys || []).reduce((tableMap, fk) => {
            tableMap[fk.joinKey.source] = fk.target;
            return tableMap;
        }, {} as { [foreignKey: string]: string });
        return map;
    }, {} as ForeignKeyMap);

  `;


  return `

   ${classCode}

    ${entryPointCode}

  `;
}

type ForeignKeyMap =  {[tk: string]: {[fk: string]: keyof DatabaseMeta}} & {
  string: {
    [foreignKey: string]: string;
  };
};


function generateForeignKeyMap(databaseMeta: DatabaseMeta): ForeignKeyMap {
  return Object.entries(databaseMeta).reduce((map, [tableName, tableMeta]) => {
    // console.log("Gen foreight keys", tableName, tableMeta)
    map[tableName] = (tableMeta!.discoveredForeignKeys || []).reduce((tableMap, fk) => {
      tableMap[fk.joinKey.source] = fk.target;
      return tableMap;
    }, {}  );
    return map;
  }, {} as ForeignKeyMap);
}


function getColumnDescription(columnName: string, columns: ColumnMeta[]): string {
  const column = columns.find(c => c.name === columnName);
  return column ? `- ${column.description}` : '';
}


function isOne(joinColumns: { source: string; target: string }[], targetPrimaryKey: PrimaryKeyMeta[]): boolean {
  const joinColumnTargets = joinColumns.map(jc => jc.target);
  return targetPrimaryKey.every(pk => joinColumnTargets.includes(pk.columnName));
}

function getTypeScriptType(columnType: string): string {
  switch (columnType.toLowerCase()) {
    case 'float':
    case 'numeric':
    case 'integer':
      return 'number';
    case 'varchar':
    case 'datetime':
    case 'datetime (local)':
      return 'string';
    default:
      return 'string';
  }
}

function getColumnType(columnName: string, columns: ColumnMeta[]): string {
  const column = columns.find(c => c.name === columnName);
  return column ? column.type : 'any';
}

const ehiFile = Bun.file('ehi-merged.json');
const ehi = await ehiFile.json();

const databaseMeta: DatabaseMeta = ehi.$meta.schemas;
const databaseData = ehi;
const generatedCode = generateTypeScriptCode(databaseMeta, databaseData);
console.log(generatedCode);