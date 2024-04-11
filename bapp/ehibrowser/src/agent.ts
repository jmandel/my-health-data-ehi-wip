import { OpenAIWrapper } from "./models.ts";
import tableExtractionGuide, {
  TableExtractionState,
} from "./guides/TableExtraction.ts";
import analyzeGuide, { AnalyzeState } from "./guides/DataAnalysis.ts";
import { GuidedTask } from "./guides/GuidedTask.ts";
import { chunk } from "./util";
import developReactComponentGuide, {
  DevelopReactComponentState,
} from "./guides/DevelopReactComponent.ts";

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
