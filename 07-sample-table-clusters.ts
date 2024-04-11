import fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('input', {
    alias: 'i',
    describe: 'Input JSON file',
    default: 'ehi-merged.json',
    type: 'string',
  })
  .option('count', {
    alias: 'n',
    describe: 'Number of times to sample table clusters',
    default: 1,
    type: 'number',
  })
  .help('help')
  .alias('help', 'h')
  .parseSync();

// Read the input JSON file
const jsonData = JSON.parse(fs.readFileSync(argv.input, 'utf-8'));

// Function to sample a cluster of related tables
export function sampleTables() {
  const schemas = jsonData.$meta.schemas;
  const tableNames = Object.keys(schemas);

  // Pick a random focus table
  const focusTable = tableNames[Math.floor(Math.random() * tableNames.length)];
  const focusSchema = schemas[focusTable];

  // Create a set to store the cluster of related tables
  const cluster = new Set([focusTable]);

  // Add parent tables to the cluster
  focusSchema.discoveredMappings?.forEach((mapping) => {
    if (mapping.type === 'has-parent-table') {
      cluster.add(mapping.target);
    }
  });

  // Get the primary key column names of the focus table
  const primaryKeyColumns = focusSchema.primaryKey?.map((pk) => pk.columnName);

  // Add tables joined by foreign keys that match the primary keys to the cluster
  const primaryKeyForeignKeys = focusSchema.discoveredForeignKeys?.filter((fk) =>
    primaryKeyColumns.includes(fk.joinKey.source)
  );

  primaryKeyForeignKeys?.forEach((fk) => {
    cluster.add(fk.target);
  });

  // If there are no foreign keys matching the primary keys, randomly sample two foreign keys
  if (primaryKeyForeignKeys?.length === 0) {
    const randomForeignKeys = focusSchema.discoveredForeignKeys?.sort(() => 0.5 - Math.random()).slice(0, 2);
    randomForeignKeys?.forEach((fk) => {
      cluster.add(fk.target);
    });
  }

  // If no parent tables or foreign keys found, look for other schemas with a foreign key pointing to the focus table
  if (cluster.size === 1) {
    let added = 0;
    for (const schema of Object.values(schemas)) {
      if (schema.name !== focusTable) {
        const foreignKeyToFocusTable = schema.discoveredForeignKeys?.find((fk) => fk.target === focusTable);
        if (foreignKeyToFocusTable) {
          cluster.add(schema.name);
          added++;
          if (added > 1)
          break;
        }
      }
    }
  }

  // Convert the set of table names to an array and return it
  return [focusTable, ...Array.from(cluster).filter(t => t !== focusTable)];
}

// If running from the command line, sample table clusters and print the result
if (import.meta.url === `file://${process.argv[1]}`) {
  for (let i = 0; i < argv.count; i++) {
    const sampledTableNames = sampleTables();
    console.log(JSON.stringify(sampledTableNames, null, 2));
  }
}
