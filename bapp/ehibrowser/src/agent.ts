import {query as queryIter} from "./ehi.ts";
import { LLMWrapper, OpenAIWrapper, ClaudeWrapper, ChatCompletionMessage, ChatCompletionCreateParams } from "./models.ts";


interface GuideInterface<State> {
  generateInitialPrompt(state: State): ChatCompletionMessage[];
  processOutputs(incomingMessage: string, state: State, messages: ChatCompletionMessage[]): Promise<{
    messages: ChatCompletionMessage[];
    state: State;
    done: boolean;
  }>;
}

class GuidedTask<State> {
  private llm: LLMWrapper;
  private guide: GuideInterface<State>;
  private state: State;

  constructor(openai: LLMWrapper, guide: GuideInterface<State>, initialState: State) {
    this.llm = openai;
    this.guide = guide;
    this.state = initialState;
  }

  async run(): Promise<State> {
    let conversationMessages: ChatCompletionMessage[] = this.guide.generateInitialPrompt(this.state);
    let done = false;

    while (!done) {
      const response = await this.llm.createChatCompletion({
        temperature: .8,
        model: "gpt-4-turbo-v",
        messages: conversationMessages,
      });

      const incomingMessage = response.content || "";
      conversationMessages.push({ role: "assistant", content: incomingMessage });

      const { messages, state, done: guideDone } = await this.guide.processOutputs(
        incomingMessage || "",
        this.state,
        conversationMessages
      );
      conversationMessages = messages;
      this.state = state;
      done = guideDone;
    }

    return this.state;
  }
}

interface KeywordExtractionState {
  keywords?: string[];
}

interface UserQuestionConfig {
  question: string;
}

class KeywordExtractionGuide implements GuideInterface<KeywordExtractionState> {
  private config: UserQuestionConfig;

  constructor(config: UserQuestionConfig) {
    this.config = config;
  }

  generateInitialPrompt(_state: KeywordExtractionState): ChatCompletionMessage[] {
    return [
      {
        role: "system",
        content: `You are an AI assistant helping to search for database tables that will help answer the user's question. Please pick a set of 3-6 keywords that will be sensitive and specific search terms to identify tables that can be used to answer the user's question. We'll then search the database schema using your keywords. Your goal is to identify tables that hold the key information. You can emit words or stems.`,
      },
      {
        role: "user",
        content: `The user's question is: "${this.config.question}". Please provide the most relevant keywords in a \`\`\`json code block containing a single array of keyword strings, like this: ["keyword1", "keyword2"]. Focus on specific terms likely to appears in the db table  names, column names, or descriptions.`,
      },
    ];
  }

  async processOutputs(
    incomingMessage: string,
    state: KeywordExtractionState,
    messages: ChatCompletionMessage[]
  ): Promise<{
    messages: ChatCompletionMessage[];
    state: KeywordExtractionState;
    done: boolean;
  }> {
    console.log("KW processing", incomingMessage, "state", state);
    const codeBlock = getCodeBlocks(incomingMessage, "json")[0];
    if (codeBlock) {
        try {
            const keywords = JSON.parse(codeBlock);
            state = { ...state, keywords };
            return { messages, state, done: true };
        }  catch (e) {
            messages.push({
                role: "user",
                content:
                  "I couldn't parse the JSON array of keywords in your response. Please try again, and make sure to format your response as a ```json code block containing a single array of keyword strings.",
              });
              console.log("Returning msg", messages.at(-1), "state", state)
              return { messages, state, done: false };
        }
    } else {
      messages.push({
        role: "user",
        content:
          "I couldn't find a valid JSON array of keywords in your response. Please try again, and make sure to format your response as a ```json code block containing a single array of keyword strings.",
      });
      console.log("Returning msg", messages.at(-1), "state", state)
      return { messages, state, done: false };
    }
  }
}

interface RelevantSchemaDetails {
  tables: {
    name: string;
    relevance: string;
    importantColumns: {
      name: string;
      relevance: string;
    }[];
    importantJoins: {
      relevance: string;
      targetTable: string;
      criteria: { sourceCol: string; targetCol: string }[];
    }[];
  }[];
}

interface RelevantSchemaState {
  relevantSchema?: RelevantSchemaDetails;
}

interface RelevantSchemaConfig  extends UserQuestionConfig {
  keywords: string[];
}

class RelevantSchemaGuide implements GuideInterface<RelevantSchemaState> {
  private config: RelevantSchemaConfig;

  constructor(config: RelevantSchemaConfig) {
    this.config = config;
  }

  generateInitialPrompt(_state: RelevantSchemaState): ChatCompletionMessage[] {
    return [
      {
        role: "system",
        content: `You are an AI assistant helping to find relevant tables and columns in a database schema based on keywords extracted from a user's question. Your goal is to identify the schema elements that are most likely to contain the information needed to answer the question.`,
      },
      {
        role: "user",
        content: `The user's question is: "${this.config.question}". The relevant keywords are: "${this.config.keywords.join(
          ", "
        )}".

To find relevant schema elements, you should do two things:

1. First SQLite queries in a \`\`\`sql code block to explore the schema and data. Query the sqlite_schema table using the template: "select name, sql from sqlite_schema where sql LIKE '%keyword%'". Querying "sql LIKE" is critical because table names alone are sometimes cryptic, so name-based queries are non-informative, but the "sql" col has full docstrings. Use targeted queries to see full descriptions and comments/explanations of tables including their child tables. Follow links to child tables that seem relevant, and understand the foreign keys you'll need for joining them. Inspect small snippets of instance data as you build up queries to solve your task. Sample results piece by piece and compose the pieces to make complete queries that accomplish your task. If you see errors or unexpected results, debug to track down and fix the problem. When you output a sql block, end your message and wait for the reply before proceeding. Keep running one sql block per response unti you understand the schema
2. When you've understood the schema, output the relevant schema details in a \`\`\`json code block matching this TypeScript interface:

interface RelevantSchemaDetails {
  tables: {
    name: string;
    relevance: string;
    importantColumns: {
      name: string;
      relevance: string;
    }[];
    importantJoins: {
      relevance: string;
      targetTable: string;
      criteria: { sourceCol: string; targetCol: string }[];
    }[];
  }[];
}

If no relevant schema elements are found, propose some queries to explore further.`,
      },
    ];
  }

  async processOutputs(
    incomingMessage: string,
    state: RelevantSchemaState,
    messages: ChatCompletionMessage[]
  ): Promise<{
    messages: ChatCompletionMessage[];
    state: RelevantSchemaState;
    done: boolean;
  }> {
    console.log("schema processing", incomingMessage, "state", state);
    const sqlCodeBlocks = getCodeBlocks(incomingMessage, "sql");
    for (const sqlCodeBlock of sqlCodeBlocks) {
      const result = await query(sqlCodeBlock);
      messages.push({
        role: "user",
        content: `SQL query result:\n\`\`\`\n${JSON.stringify(result, null, 2)}\n\`\`\``,
      });
    }

    const jsonCodeBlocks = getCodeBlocks(incomingMessage, "json");
    if (jsonCodeBlocks.length > 0) {
      const relevantSchema = JSON.parse(jsonCodeBlocks[0]) as RelevantSchemaDetails;
      const errors = await validateRelevantSchema(relevantSchema);
      if (errors.length > 0) {
        messages.push({
          role: "user",
          content: `I found the following errors in the proposed schema:\n\`\`\`\n${errors.join("\n")}\n\`\`\`\nPlease check the schema and try again.`,
        });
      } else {
        state = { ...state, relevantSchema };
        return { messages, state, done: true };
      }
    } else if (sqlCodeBlocks.length === 0) {
      messages.push({
        role: "user",
        content:
          "I couldn't find any SQL queries or relevant schema details in your response. Please propose some ```sql blocks with queries to explore the schema further, or provide the relevant schema details in a ```json code block.",
      });
    }

    console.log("Returning msg", messages.at(-1), "state", state)
    return { messages, state, done: false };
  }
}

export let v = 5;
// const openai = new OpenAI({apiKey: , dangerouslyAllowBrowser: true });
const openai = new OpenAIWrapper({apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY, cachePrefix: "cache_prefix", seed: "0", maxConcurrentRequests: 1, maxRetries: 3});
const userQuestion = "What are the patient's past and future vaccine administrations?";

async function runTasks() {
  // Step 1: Keyword Extraction
  const keywordExtractionConfig: UserQuestionConfig = { question: userQuestion };
  const keywordExtractionTasks = [2].map(() => {
    const keywordExtractionGuide = new KeywordExtractionGuide(keywordExtractionConfig);
    const keywordExtractionTask = new GuidedTask<KeywordExtractionState>(
      openai,
      keywordExtractionGuide,
      {},
    );
    return keywordExtractionTask.run();
  });

  const keywordExtractionStates = await Promise.all(keywordExtractionTasks);
  const keywords = keywordExtractionStates.flatMap((state) => state.keywords || []);
  console.log("Keywords:", keywords);

  // Step 2: Relevant Schema Extraction
  const NUM_SCHEMA_AGENTS=1
  const chunkSize = Math.ceil(keywords.length / NUM_SCHEMA_AGENTS);
  const keywordChunks = chunk(keywords, chunkSize);
  console.log("Keyword chunks:", keywordChunks);

  const relevantSchemaConfig: RelevantSchemaConfig = { question: userQuestion, keywords: [] };
  const relevantSchemaTasks = keywordChunks.map((chunkKeywords) => {
    const config = { ...relevantSchemaConfig, keywords: chunkKeywords };
    const relevantSchemaGuide = new RelevantSchemaGuide(config);
    return new GuidedTask<RelevantSchemaState>(openai, relevantSchemaGuide, {}).run();
  });

  const relevantSchemaStates = await Promise.all(relevantSchemaTasks);
  const mergedRelevantSchema: RelevantSchemaDetails = {
    tables: relevantSchemaStates.flatMap((state) => state.relevantSchema?.tables || []),
  };

  console.log("Relevant Schema:", mergedRelevantSchema);
}

runTasks();

function getCodeBlocks(message: string, tag: string): string[] {
  const codeBlockRegex = new RegExp(`\`\`\`${tag}\n([\\s\\S]*?)\`\`\``, "g");
  const matches = message.matchAll(codeBlockRegex);
  return Array.from(matches, (match) => match[1]);
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

async function query(sql: string): Promise<string> {
    console.log(`Executing SQL query: ${sql}`);
    try {
        const ret =  (await Array.fromAsync(queryIter(sql))).map(row => JSON.stringify(row).slice(0, 2000) + (JSON.stringify(row).length > 2000 ? "...<truncated>" : "")).join("\n");
        console.log(`Query result: ${ret.slice(0, 100000) + (ret.length > 100000 ? "...<truncated>" : "") }`);
        return ret;
    } catch (error: any) {
        console.log(`Query Error: ${error.message}`);
        return `Error: ${error.message}`;
    } 
}

async function validateRelevantSchema(relevantSchema: RelevantSchemaDetails): Promise<string[]> {
  const errors: string[] = [];

  for (const table of relevantSchema.tables) {
    const tableInfo = await Array.fromAsync(queryIter(`PRAGMA table_info(${table.name});`))
    const columnNames = tableInfo.map((column: any) => column.name);

    for (const column of table.importantColumns) {
      if (!columnNames.includes(column.name)) {
        errors.push(`There is no table ${table.name} with column '${column.name}'.`);
      }
    }

    for (const join of table.importantJoins) {
      const targetTableInfo = await Array.fromAsync(queryIter(`PRAGMA table_info(${join.targetTable});`));
      const targetColumnNames = targetTableInfo.map((column: any) => column.name);

      for (const criteria of join.criteria) {
        if (!columnNames.includes(criteria.sourceCol)) {
          errors.push(`Source column '${criteria.sourceCol}' does not exist in table '${table.name}'.`);
        }
        if (!targetColumnNames.includes(criteria.targetCol)) {
          errors.push(`Target column '${criteria.targetCol}' does not exist in table '${join.targetTable}'.`);
        }
      }
    }
  }

  return errors;
}