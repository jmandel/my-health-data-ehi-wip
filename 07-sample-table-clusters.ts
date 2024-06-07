import fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import {processTablesToString} from './src/sampleRows';
import {llms} from './src/agent'
import { readdir, readFile, writeFile } from "fs/promises";

const promptSystem = (schema, focus) => `
You are an AI assistant tasked with generating interesting and insightful questions that can be answered using the provided TypeScript interfaces and their relationships. For each question, you should also provide a short JavaScript program that demonstrates how to retrieve the answer from the given schema.

### Schema:
${schema}

### Coding
You can write code to execute by writing \`\`\`js code blocks using:

* \`db\`: entrypoint object with a value for each type (e.g., \`db.FOO\` is an array of all FOO records). Within a record: upper-case properties are primitives; lower-case properties navigate across parent/child and foreign key relationships -- but be careful of nulls.
  * Note: db objects are wrappers that cannot be compared by equality, only by their primitives.
  * Note: db is about only a single patient, so no patient matching or cross-patient analysis is relevant.
* \`_\`: lodash -- you can use this for rich focused analysis.
* \`console.log\` will let you see results that you can use for further analysis.

### Guidelines:
1. Carefully examine the provided schema, paying close attention to the relationships between interfaces and their properties.
2. ${promptUser(schema, focus)}
3. Ensure that the question is clear, specific, and answerable using the given schema. Be precise about the value of the output (type, meaning, etc).
4. Write a concise JavaScript program that retrieves the answer to the question using the provided schema.
5. Use the \`db\` object and \`_\` and \`console.log\` to access the data, assuming it follows the structure of the given interfaces.
7. Output the answer as your final \`console.log\`.

Example question and answer format:
---
Question: [Your generated question here]

\`\`\`js
// Your JavaScript code
\`\`\`
`
const promptUser = (_schema, focus) => `Generate a programming question that leverages the schema's structure and relationships. Ensure that you put emphasis on the \`${focus}\` interface.

The question must be simple and avoid conditionals that narrow down the data set.

The answer to the question must be a single string or number. It must require data from at least two interfaces to answer correctly.

The question must work for any data set, meaning it must be carefully designed to ensure that no data dependencies are incorporated into the formulation. Be cautious about "?" nullable TS properties.

You must articulate the question clearly enough that the answer can be re-derived precisely by an independent developer.`

// Function to sample a cluster of related tables
export function sampleTables(jsonData) {
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

  for (let i = 0; i < argv.count; i++) {
    const sampledTableNames = sampleTables(jsonData);
    console.log(JSON.stringify(sampledTableNames, null, 2));
    const clusterAsString = processTablesToString(sampledTableNames, jsonData, {sampleSize: 1, includeAllForeignKeys: false, expandTablesPolicy: {parents: true, children: false, foreign: "pk", relatedTables: "none"}});
    console.log(clusterAsString)
    const ps = promptSystem(clusterAsString, sampledTableNames[0]);
    const pu = promptUser(clusterAsString, sampledTableNames[0]);
    if (ps.length + pu.length > 30000) {
      console.log("prompt too long", ps.length)
      continue;
    }
    try {
    const result = await llms["gpt4v"].createChatCompletion({messages: [{role: "system", content: ps }, {role: "user", content: pu}]})
    console.log(result)
    const details = {sampledTableNames, clusterAsString, ps, pu, result: result.content}
    // generate a unique filename based on sampledTableNames[0]
    const files = await readdir("question-bank")
    const file = `question-bank/${sampledTableNames[0].replace(/[^a-zA-Z0-9]/g, "_")}-${files.length}.json`
    // write json
    await writeFile(file, JSON.stringify(details, null, 2), "utf-8");
    } catch(e) {
      console.error(e)
    }
  }
}
