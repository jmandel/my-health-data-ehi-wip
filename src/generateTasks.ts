import { ChatCompletionCreateParams, ChatCompletionMessage, OpenAIWrapper } from "./models.ts";
import { GuidedTask } from "./guides/GuidedTask.ts";

const llmGpt4V = new OpenAIWrapper({
  apiKey: "",
  cachePrefix: "cache_prefix",
  seed: "3",
  maxConcurrentRequests: 1,
  maxRetries: 3,
  defaultModel: "azure-gpt-4-turbo-v",
  baseUrl: "http://localhost:4000",
});

const llmSonnet = new OpenAIWrapper({
  apiKey: "",
  cachePrefix: "cache_prefix",
  seed: "3",
  defaultModel: "claude-3-sonnet",
  baseUrl: "http://localhost:4000",
});

export async function answerQuestionWithComponent(userQuestion: string) {
  async function runTasks() {
    // Step 1: Identify Key Tables
    const schemaExtractionTasks = [1].map(() => {
      const schemaExtractionTask = new GuidedTask<TableExtractionState>(
        llmSonnet,
        tableExtractionGuide,
        {
          question: userQuestion,
          turns: 0,
        }
      );
      return schemaExtractionTask.run();
    });

    const schemaExtractionStates = await Promise.all(schemaExtractionTasks);
    const tables = schemaExtractionStates.flatMap(
      (state) => state.tables || []
    );
    console.log("Table:", tables);

    // Step 2: Analyze Data
    const NUM_SCHEMA_AGENTS = 1;
    const chunkSize = Math.ceil(tables.length / NUM_SCHEMA_AGENTS);
    const tableChunks = chunk(tables, chunkSize);
    console.log("Tables chunks:", tableChunks);

    const relevantSchemaTasks = tableChunks.map((chunkTables) => {
      return new GuidedTask<AnalyzeState>(llmSonnet, analyzeGuide, {
        progress: "starting",
        question: userQuestion,
        turns: 0,
        tables: chunkTables,
        queries: [],
      }).run();
    });
    const analysisStates = await Promise.all(relevantSchemaTasks);

    const reactComponetTask = await new GuidedTask<DevelopReactComponentState>(
      llmSonnet,
      developReactComponentGuide,
      {
        question: userQuestion,
        component: "",
        turns: 0,
        history: analysisStates[0].history || [],
      }
    ).run();

    console.log("ANALYSIS STATE");
    console.log(JSON.stringify(analysisStates, null, 2));
    return reactComponetTask.component;
  }

  return await runTasks();
}

import ehiMerged from "./ehi-merged.json";
import * as util from './util'

import { Database } from "bun:sqlite";
const db = new Database("../../db.sqlite");
async function* query(sql, params = []) {
  const query = db.query(sql);
  for (const row of query.all()) {
    yield row
  }
}

util.queryOverride.queryIter = query;
console.log(await util.queryToString("SELECT name FROM sqlite_schema;"));


import fs from "fs";
import processTables from "./06-sample-rows.ts";
import  {sampleTables} from "../../../07-sample-table-clusters.ts"
import sqliteGuide, { SqliteGuideState } from "./guides/SqliteGuide.ts";
let i = 0;
while (i < 100) {
  let t = sampleTables(ehiMerged);
  if (!ehiMerged.$meta.schemas[t[0]]?.discoveredMappings?.find(fk => fk.type === "has-child-table")) {
    continue;
  }
  i++
  console.log(t)
  const schemaSnippet = processTables(t);
  console.log(JSON.stringify(schemaSnippet, null, 2))
  process.exit(0)
  const messages = [{
      "role": "system",
      "content": `Play the role of a health informatics assistant, expert in data modeling and SQL. You are aware of the following tables from Epic's Electronic Health Information Export.\n${JSON.stringify(schemaSnippet, null, 2)}`
  }, {
    "role": "user",
    "content": `Focusing on ${t[0]}, and using the other tables as needed, your task is to create a hierarchical data structure that can be displayed in a clinical dashboard environment.  Focus on end user delight. Output a description of the dashboard and then a  \`\`\`sqlite block with SQL query for generating the target structure, using only the documented tables and columns (your sqlite block will be rejected if it uses incorrect or nonexistent tables/columns). Leverage json_object with nested queries, and use CTEs if you need to. Be careful about joining across parent/child relationships -- if you join, also GROUP BY, or better still incorporate subqueries into hierarchical JSON generation.  Return one JSON object per selected row, i.e. \`select json_object(...\`. Be careful to apply \`json(...\` to nested  strings consistently. Do not include IDs alone, but find the names of the entities you identify and include those too.  Design the query to select all data; no need to filter by patient because there's only one patient in the DB.
`
}]
  console.log(messages)
  const r = await llmGpt4V.createChatCompletion({ messages });
  console.log(r.content)
  fs.writeFileSync(`generated_views/${(i).toString().padStart(2, '0')}.json`, JSON.stringify({tables: t, prompt: messages, response: r}, null, 2));

  messages.push(r)
    const fixSqlTask = await new GuidedTask<SqliteGuideState>(
      llmGpt4V,
      sqliteGuide, 
      {
        turns: 0,
        history: messages as ChatCompletionMessage[],
      }
    ).run();


  fs.writeFileSync(`generated_views/${(i++).toString().padStart(2, '0')}.fixed.json`, JSON.stringify(fixSqlTask, null, 2));
}
