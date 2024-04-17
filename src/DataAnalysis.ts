import { queryTables, queryTables2, queryTables3 } from "../prompts.ts";
import { ChatCompletionMessage } from "../models.ts";
import jsonic from 'jsonic';
import { getCodeBlocks, queryToRows, queryToString } from "../util";
import { GuideInterface } from "./GuideInterface.ts";
import { identity } from "lodash";
import processTables from "../06-sample-rows.ts";

export interface AnalyzeState  {
    question: string;
    turns: number;
    progress?: "starting" | "queried-one" | "queried-multiple"
    tables: string[];
    history?: ChatCompletionMessage[];
    queries: {
      sql: string;
      result: string;
    }[];
}


const analyzeGuide: GuideInterface<AnalyzeState> = {
    generateInitialPrompt(state: AnalyzeState): ChatCompletionMessage[] {
        const schemaSnippet = processTables(state.tables);
        state.tables = Object.keys(schemaSnippet);
        return [
            {
                role: "system",
                content: queryTables(schemaSnippet)
            },
            {
                role: "user",
                content: state.question +
`initially query all columns in the most relevant table and wait for me to send you the result. Use a \`\`\`sqlite to perform the query.`

            }
        ];
    },

    async processOutputs(
        incomingMessage: string,
        state: AnalyzeState,
        messages: ChatCompletionMessage[]
    ): Promise<{
        messages: ChatCompletionMessage[];
        state: AnalyzeState;
        done: boolean;
    }> {
        console.log("schema processing", incomingMessage, "state", state);
        const sqlCodeBlocks = getCodeBlocks(incomingMessage, "sql", "sqlite");
        let preventProgress = sqlCodeBlocks.length === 0;
        for (const sqlCodeBlock of sqlCodeBlocks) {
            const [qResult, qStatus] = await queryToString(sqlCodeBlock);
            if (sqlCodeBlock.match(/FROM sqlite_schema/i) && qStatus === "success") {
                state.tables = [...state.tables,  ...(await queryToRows(sqlCodeBlock)).map(row => row.name as string).filter(identity)];
            }
            if (qStatus === "error" || qResult.length === 0) { preventProgress = true; }
            state.queries.push({ sql: sqlCodeBlock, result: qResult });
            messages.push({
                role: "user",
                content: `SQL query result:\n\njson\n${qResult}\n` +
                    (qResult.length === 0 ? "No results found. Please adjust as needed." : ""),
            });
            console.log("Add message", messages.at(-1))
        }

        console.log("Prevent progress?", preventProgress)
        if (!preventProgress) {
            if (state.progress === "starting" || !state.progress) {
                state.progress = "queried-one";
                messages.push({
                    role: "user",
                    content: queryTables2
                })
            console.log("Add message", messages.at(-1))
            } else if (state.progress === "queried-one") {
                state.progress = "queried-multiple";
                messages.push({
                    role: "user",
                    content: queryTables3
                })
            console.log("Add message", messages.at(-1))
            } 
        }

        const jsonCodeBlocks = getCodeBlocks(incomingMessage, "json");
        if (jsonCodeBlocks.length > 0 && !preventProgress) {
            const completeResponse = jsonic(jsonCodeBlocks[0]);
            if (completeResponse.complete) {
                state.history = messages;
                return { messages, state, done: true };
            }
        }

        if (sqlCodeBlocks.length + jsonCodeBlocks.length === 0) {
            messages.push({
                role: "user",
                content: "I couldn't find any SQL queries or a ```json complete block. Please propose some ```sql blocks with queries to explore the schema further, or indicate success with a ```json code block.",
            });
            console.log("Add message", messages.at(-1))
        }

        console.log("Returning msg", messages.at(-1), "state", state);
        return { messages, state, done: false };
    }
};

export default analyzeGuide;