import { OpenAIWrapper } from "./models.ts";
import { GuidedTask } from "./guides/GuidedTask.ts";

const llmGpt4V = new OpenAIWrapper({
  apiKey: "",
  cachePrefix: "cache_prefix",
  seed: "3",
  maxConcurrentRequests: 1,
  maxTries: 3,
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


import fs from "fs";
import processTables from "./06-sample-rows.ts";
const tasks = JSON.parse(fs.readFileSync("../../clusters.json"));
let i = 0;
for (const t of tasks) {
  console.log(t);
  const schemaSnippet = processTables(t);
  const messages = [{
      "role": "system",
      "content": `Play the role of a health informatics assistant, expert in data modeling and SQL. You are aware of the following tables from Epic's Electronic Health Information Export.\n${JSON.stringify(schemaSnippet, null, 2)}`
  }, {
    "role": "user",
    "content": `Focusing on ${t[0]}, and using the other tables as needed, your task is to create a training exercise for informatics students. Output a set of 3 natural language questions that can be answered from the tables supplied, focusing on ${t}.  Do not include table names or entity identifiers; keep your questions natural. Create one easy question, one medium, and one hard -- and provide a brief query plan for each, and a SQL query that uses only the documented tables and columns.
Output a \`\`\`json  code block with a QuerySet using the following schema:

interface QuerySet {
  queries: {
    difficulty: "easy" | "medium" | "hard",
    question: string,
    queryPlan: string,
    sql: string
  }[]
}
`
}]
console.log(messages)
  const r = await llmGpt4V.createChatCompletion({ messages });
  console.log(r.content)
  fs.writeFileSync(`generated_queries/${i++}.json`, JSON.stringify({tables: t, prompt: messages, response: r}, null, 2));
  
}
