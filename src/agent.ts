import { OpenAIWrapper } from "./models.ts";
import tableExtractionGuide, {
  TableExtractionState,
} from "./guides/TableExtraction.ts";
import analyzeGuide, { AnalyzeState } from "./guides/DataAnalysis.ts";
import { GuidedTask } from "./guides/GuidedTask.ts";
import developReactComponentGuide, {
  DevelopReactComponentState,
} from "./guides/DevelopReactComponent.ts";

const llmGpt4V = new OpenAIWrapper({
  apiKey: "",
  cachePrefix: "cache_prefix",
  // seed: "3",
  maxConcurrentRequests: 1,
  // maxRetries: 3,
  defaultModel: "azure-gpt-4-turbo-v",
  baseUrl: "http://localhost:4000",
});

const llmSonnet = new OpenAIWrapper({
  apiKey: "",
  cachePrefix: "cache_prefix",
  // seed: "3",
  defaultModel: "claude-3-sonnet",
  baseUrl: "http://localhost:4000",
});

const llmHaiku = new OpenAIWrapper({
  apiKey: "",
  cachePrefix: "cache_prefix",
  // seed: null,
  defaultModel: "claude-3-haiku",
  baseUrl: "http://localhost:4000",
});

const llmMixtral22b = new OpenAIWrapper({
  cachePrefix: "cache_prefix",
  // seed: "4",
  defaultModel: "mixtral22b",
  baseUrl: "http://localhost:4000",
});


export const llm = llmSonnet;
export const llms =  {
  "gpt4v": llmGpt4V,
  "sonnet": llmSonnet,
  "haiku": llmHaiku,
  "mixtral22b": llmMixtral22b,
}

export async function getTableList(userQuestion: string, llm: OpenAIWrapper) {
      const schemaExtractionTask = new GuidedTask<TableExtractionState>(
        llm,
        tableExtractionGuide,
        {
          question: userQuestion,
          turns: 0,
        }
      );
      const res =  await schemaExtractionTask.run();
      return res.tables || [];
  }


export async function answerQuestionWithComponent(userQuestion: string) {
  async function runTasks() {
    // Step 1: Identify Key Tables
    const tables = await getTableList(userQuestion);
    console.log("Table:", tables);

    // Step 2: Analyze Data
    const relevantSchemaTasks = new GuidedTask<AnalyzeState>(llmGpt4V, analyzeGuide, {
        progress: "starting",
        question: userQuestion,
        turns: 0,
        tables
      }).run();

    const analysisStates = await relevantSchemaTasks;
    console.log("ANALYSIS STATE");
    console.log(JSON.stringify(analysisStates, null, 2));

    const reactComponetTask = await new GuidedTask<DevelopReactComponentState>(
      llmGpt4V,
      developReactComponentGuide,
      {
        question: userQuestion,
        component: "",
        turns: 0,
        history: analysisStates.history || [],
      }
    ).run();

    return reactComponetTask.component;
  }

  return await runTasks();
}
