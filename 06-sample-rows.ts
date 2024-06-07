import _ from 'lodash';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {processTables} from './src/sampleRows'
import client from "./src/client"


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