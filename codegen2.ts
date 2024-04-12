import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Define the schema interfaces
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

// Function to generate TypeScript interfaces from schemas with documentation and relationship handling
export function generateInterfaces(schemas: { [key: string]: SchemaTable }): string {
    let code = ''; 
    for (const [tableName, schema] of Object.entries(schemas)) {
        // Table description (limited to the first sentence for clarity)
        const tableDescription = schema.description.split('. ')[0];
        const primaryKeyDescription = "pk: " + schema.primaryKey.map((pk) => pk.columnName).join(', ');
        code += `/**\n * ${tableDescription}\n * ${primaryKeyDescription}\n */\n`;
        code += `export interface ${tableName} {\n`;

        schema.columns.forEach((column) => {
            let tsType = 'string'; // Default type
            switch (column.type.split(' ')[0].toUpperCase()) {
                case 'NUMERIC':
                case 'FLOAT':
                case 'INTEGER': tsType = 'number'; break;
                case 'DATETIME': tsType = 'Date'; break;
                case 'VARCHAR': tsType = 'string'; break;
                default: throw new Error(`Unrecognized data type '${column.type}' for column '${column.name}' in table '${tableName}'`);
            }
            // Column description (limited to the first sentence)
            const columnDescription = column.description.split('. ')[0];
            code += `    /**\n     * ${columnDescription}\n     */\n`;
            code += `    ${column.name}: ${tsType};\n`;

            // Adding references for foreign keys
            schema.discoveredForeignKeys?.filter(m => m.source === tableName && m.joinKey.source === column.name).forEach((fk) => {
                const referenceName = fk.joinKey.source.split('_').slice(0, -1).join('_').toLowerCase();
                code += `    /**\n     * Reference to ${fk.target} based on ${fk.joinKey.source}\n     */\n`;
                code += `    ${referenceName.toLowerCase()}?: ${fk.target};\n`;
            });

        });

        // Handling parent and child table mappings
        schema.discoveredMappings?.forEach((mapping) => {
            const referenceName = mapping.target;
            if (mapping.type === 'has-child-table') {
                code += `    /**\n     * Collection of ${mapping.target} as children joined on ${mapping.joinKeys.map(k => `${tableName}.${k.source}=${referenceName}.${k.target}`).join(", ")}\n     */\n`;
                code += `    ${referenceName.toLowerCase()}?: ${mapping.target}[];\n`;
            } else if (mapping.type === 'has-parent-table') {
                code += `    /**\n     * Reference to parent ${mapping.target}\n     */\n`;
                code += `    ${referenceName.toLowerCase()}?: ${mapping.target};\n`;
            }
        });


        code += '}\n\n';
    }
    return code;
}


if (import.meta.url === `file://${process.argv[1]}`) {
// Runner script using yargs to handle command-line arguments
yargs(hideBin(process.argv))
  .scriptName("generate-ts")
  .usage('$0 --schema <path>')
  .option('schema', {
    describe: 'Path to the JSON schema file',
    type: 'string',
    default: 'schema.json',
    nargs: 1
  })
  .help()
  .alias('help', 'h')
  .parseAsync()
  .then(args => {
    const schemaPath = args.schema;
    const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const output = generateInterfaces(schemaData.$meta.schemas);
    console.log(output);
  })
  .catch(error => {
    console.error('Failed to generate TypeScript interfaces:', error);
    process.exit(1);
  });
}