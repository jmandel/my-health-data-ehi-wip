import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import _ from 'lodash';

interface Schema {
  name: string;
  primaryKey: { columnName: string }[];
  columns: {
    name: string;
    type: string;
    mergedFrom?: string;
  }[];
}

interface Table {
  [columnName: string]: unknown;
}

const argv = await yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    describe: 'Path to the input ehi.json file',
    default: 'ehi-merged.json',
    demandOption: true,
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    describe: 'Path to the output directory',
    demandOption: true,
    default: 'json',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv;

const inputFilePath = argv.input;
const outputDirPath = argv.output;

try {
  // Read the input ehi.json file
  const ehiData = JSON.parse(await Bun.file(inputFilePath).text());

  // Extract the schemas and tables from the ehiData
  const schemas: { [tableName: string]: Schema } = ehiData.$meta.schemas;
  const tables: { [tableName: string]: Table[] } = {};

  for (const tableName in ehiData) {
    if (tableName !== '$meta') {
      tables[tableName] = ehiData[tableName];
    }
  }

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  // Process each table and output as a separate JSON file
  for (const tableName in tables) {
    const tableData = tables[tableName];
    const schema = schemas[tableName];

    // Sort the rows in the table by the primary key columns
    const sortedTableData = _.sortBy(tableData, schema.primaryKey.map(pk => pk.columnName));

    const outputData = {
      $meta: {
        schemas: {
          [tableName]: schema,
        },
      },
      [tableName]: sortedTableData,
    };

    const outputFilePath = path.join(outputDirPath, `${tableName}.json`);
    await Bun.write(outputFilePath, JSON.stringify(outputData, null, 2));

    console.log(`Output generated for table: ${tableName}`);
  }

  console.log('All tables processed successfully.');
} catch (error) {
  console.error('An error occurred:', error);
  process.exit(1);
}