import { OpenAIWrapper } from "./models.ts";
import tableExtractionGuide, {
  TableExtractionState,
} from "./guides/TableExtraction.ts";
import analyzeGuide, { AnalyzeState } from "./guides/DataAnalysis.ts";
import { GuidedTask } from "./guides/GuidedTask.ts";
import developReactComponentGuide, {
  DevelopReactComponentState,
} from "./guides/DevelopReactComponent.ts";

// Get OpenRouter API key from localStorage
function getOpenRouterApiKey(): string {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("openrouter_api_key") || "";
  }
  return "";
}

// Create LLM instances with OpenRouter
function createLLMs() {
  const apiKey = getOpenRouterApiKey();
  const openRouterBaseUrl = "https://openrouter.ai/api/v1";
  
  return {
    "claude-sonnet-4.5": new OpenAIWrapper({
      apiKey,
      cachePrefix: "cache_prefix",
      maxConcurrentRequests: 1,
      defaultModel: "anthropic/claude-sonnet-4.5",
      baseUrl: openRouterBaseUrl,
    }),
    "deepseek-r1": new OpenAIWrapper({
      apiKey,
      cachePrefix: "cache_prefix",
      maxConcurrentRequests: 1,
      defaultModel: "deepseek/deepseek-r1",
      baseUrl: openRouterBaseUrl,
    }),
    "qwen-3-thinking-22a": new OpenAIWrapper({
      apiKey,
      cachePrefix: "cache_prefix",
      maxConcurrentRequests: 1,
      defaultModel: "qwen/qwen-3-thinking-22a",
      baseUrl: openRouterBaseUrl,
    }),
  };
}

export const llms = createLLMs();
export const llm = llms["claude-sonnet-4.5"];

// Function to refresh LLM instances when API key changes
export function refreshLLMs() {
  const newLLMs = createLLMs();
  Object.keys(newLLMs).forEach(key => {
    llms[key] = newLLMs[key];
  });
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
    const tables = await getTableList(userQuestion, llm);
    console.log("Table:", tables);

    // Step 2: Analyze Data
    const relevantSchemaTasks = new GuidedTask<AnalyzeState>(llm, analyzeGuide, {
        progress: "starting",
        question: userQuestion,
        turns: 0,
        tables
      }).run();

    const analysisStates = await relevantSchemaTasks;
    console.log("ANALYSIS STATE");
    console.log(JSON.stringify(analysisStates, null, 2));

    const reactComponetTask = await new GuidedTask<DevelopReactComponentState>(
      llm,
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
