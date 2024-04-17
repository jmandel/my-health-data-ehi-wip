interface Column {
    ordinalPosition: number;
    name: string;
    type: string;
    discontinued: boolean;
    description: string;
    entries?: string[];
}

interface ForeignKey {
    source: string;
    target: string;
    joinKey: {
        source: string;
        target: string;
    };
}

interface ChildTable {
    type: string;
    source: string;
    target: string;
    joinKeys: { source: string; target: string }[];
}

interface Schema {
    [key: string]: TableSchema;
}

interface TableSchema {
    name: string;
    description: string;
    primaryKey: { columnName: string; ordinalPosition: number }[];
    columns: Column[];
    discoveredMappings?: ChildTable[];
    discoveredForeignKeys?: ForeignKey[];
}


function createJsonObjectFromChunks(fields: string[], chunkSize: number): string[] {
    const chunks = [];
    for (let i = 0; i < fields.length; i += chunkSize) {
        chunks.push(`json_object(${fields.slice(i, i + chunkSize).join(', ')})`);
    }
    return chunks;
}

function mergeJsonChunks(chunks: string[]): string {
    return chunks.slice(1).reduce((acc, chunk) => `json_patch(${acc}, ${chunk})`, chunks[0]);
}

function constructJsonFields(tableName: string, schemas: Schema, level: number = 0): string[] {
    const indent = ' '.repeat(level * 4);
    const tableSchema = schemas[tableName];

    // Generate fields with possible foreign key subqueries and handle them similarly
    const fields = tableSchema.columns.map(col => {
        const foreignKey = tableSchema.discoveredForeignKeys?.find(fk => fk.joinKey.source === col.name);
        if (foreignKey) {
            const foreignTableSchema = schemas[foreignKey.target];
            const foreignFields = foreignTableSchema.columns.map(fcol => `'${fcol.name}', ${fcol.name}`);
            const foreignChunks = createJsonObjectFromChunks(foreignFields, 60);
            const mergedForeignJson = mergeJsonChunks(foreignChunks);
            return `${indent}'${col.name.split("_").slice(0,-1).join("_")}', (SELECT ${mergedForeignJson} FROM ${foreignKey.target} WHERE ${foreignKey.joinKey.target} = ${tableName}.${foreignKey.joinKey.source})`;
        } else {
            return `${indent}'${col.name}', ${col.name}`;
        }
    });

    return createJsonObjectFromChunks(fields, 60);
}

function generateFullQueryForTable(tableName: string, schemas: Schema, level: number = 0): Promise<string> {
    const tableSchema = schemas[tableName];
    const jsonFieldsChunks = constructJsonFields(tableName, schemas, level + 1);
    const childTableAggregations = tableSchema.discoveredMappings ? aggregateChildTables(tableName, tableSchema.discoveredMappings, schemas, level + 1) : '';
    const mergedJsonFields = mergeJsonChunks(jsonFieldsChunks);

    return `
SELECT 
    json_patch(${mergedJsonFields}, json_object(${childTableAggregations ? '\n' + childTableAggregations : ''}))
AS full_data
FROM ${tableName}
    `.trim();
}


// Function to aggregate JSON objects from child tables, accounting for all join keys
function aggregateChildTables(tableName: string, childTables: ChildTable[],  schemas: Schema, level: number,): string {
    const indent = ' '.repeat(level * 4);
    return childTables.filter(f => f.type === "has-child-table").slice(0, 20).map(child => {
        const joinConditions = child.joinKeys
            .map(joinKey => `${child.target}.${joinKey.target} = ${tableName}.${joinKey.source}`)
            .join(' AND ');  // Concatenate all join conditions with 'AND'

        return `${indent}'${child.target}', (\n${indent + '    '}SELECT json_group_array(json(${constructJsonFields(child.target, schemas, level + 1)}))\n${indent + '    '}FROM ${child.target}\n${indent + '    '}WHERE ${joinConditions}\n${indent})`;
    }).join(',\n');
}


// Example call within a larger function, such as generateFullQueryForTable
async function runCLI() {
    // Dynamic imports for Node.js-specific modules
    const fs = await import('fs').then(module => module.promises);
    const yargs = (await import('yargs')).default;
    // console.log(yargs)
    const { hideBin } = await import('yargs/helpers');

    const argv = yargs(hideBin(process.argv))
        .options({
            'input-file': { type: 'string', demandOption: true, alias: 'i' },
            'start-table': { type: 'string', demandOption: true, alias: 't' }
        })
        .parse();

    const fileContent = await fs.readFile(argv['input-file'], 'utf8');
    const schemas: Schema = JSON.parse(fileContent).$meta.schemas;

    const query = await generateFullQueryForTable(argv['start-table'], schemas);
    console.log(query);
}

// Conditional execution based on environment
if (typeof process !== 'undefined' && process.argv) {
    // Ensure this code runs only when executed directly, not when imported
    if (import.meta.url === new URL(import.meta.url).href) {
        runCLI().catch(error => console.error("CLI Error:", error));
    }
} else {
    console.log("This module is running in a non-CLI environment.");
}

// Additional functions that don't depend on CLI-specific modules can be placed outside the conditional block
