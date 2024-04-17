import _ from 'lodash';
import { db } from "../client";
import { ChatCompletionMessage } from "../models.ts";
import { queryTables } from "../prompts.ts";
import { processTablesToString } from "../sampleRows.ts";
import { getCodeBlocks } from "../util";
import { GuideInterface } from "./GuideInterface.ts";
import jsonic from 'jsonic';

export interface AnalyzeState  {
    question: string;
    turns: number;
    progress?: "starting" | "queried-one" | "queried-multiple"
    tables: string[];
    history?: ChatCompletionMessage[];
    component?: string;
}

const analyzeGuide: GuideInterface<AnalyzeState> = {
    async generateInitialPrompt(state: AnalyzeState): Promise<ChatCompletionMessage[]> {
        const schemaSnippet = processTablesToString(JSON.parse(JSON.stringify(state.tables)), db.ehi);
        // state.tables = Object.keys(schemaSnippet);
        return [
            {
                role: "system",
                content: queryTables(schemaSnippet)
            },
            {
                role: "user",
                content: state.question +`
Approach: Think about a generalized version of the user's question, and outline the design for a dashboard that could answer this question. The dashboard is powered by a pure function over the EHI data. Write documentation for  a JS function called \`compute(config)\` that generates the dashboard data given a simple config object representing user-supplied parameters, and returns a result structure of your choice. 

Document the config settings in a simple bullet list. Then output 2-3 test cases represented as a JSON array of config objects in a \`\`\`json code block:

\`\`\`json
[{test-config-1},{test-config-2},{test-config-3}]
\`\`\`


Now it's time to write the \`compute(config){... return data;}\` function. Make good use of the interface->interface references even though they're omitted from the serialized JS rows above to save space. You have access to the following variables:

* \`_\`: lodash

* \`db(tableName)\`: interface to query all rows from a table, returning ORM rows that follow the interfaces above. 
NOTE: The db has data about only a single patient, so  no patient matching or cross-patient analysis is relevant.
Data lookups should be flexible, not overly rigid. Anticipate nulls or missing data.

Output one \`\`\`js code block and end your response.`

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
        let configs = jsonic(getCodeBlocks(incomingMessage, "json")[0])
        if (!Array.isArray(configs)) {
            configs = []
        }

        console.log("schema processing", incomingMessage, "state", state);
        const jsCodeBlocks = getCodeBlocks(incomingMessage, "js", "javascript");
        let anyError = false;
        for (const config of configs) {
            console.log("Evaluating config", config)
            if (!jsCodeBlocks.length) {
                anyError = true;
                messages.push({
                    "role": "user",
                    "content": `Please supply a compute function in a \`\`\`js block.`
                });
            }
            for (const block of jsCodeBlocks) {
                try {
                    const evalComponent = new Function('_', 'db', block + "\n return compute;");
                    const result = evalComponent(_, db)(config);
                    const resultString = JSON.stringify(result, null, 2);
                    console.log(config, resultString)
                    // if (resultString.length < 5) {
                    //     throw  new Error(`No result (observed: \`${resultString}\`). Please try again, updating the test case or your function as needed.`);
                    // }
                    messages.push({
                        "role": "user",
                        "content": `Config ${JSON.stringify(config)}: compute(config) executed successfully and returned ` + JSON.stringify(result).slice(0, 500) + "..."
                    });
                    console.log("Config fn returned", result)
                } catch (e) {
                    console.log("Config fn returned", e)
                    if (!window.e) window.e =e ;
                    messages.push({
                        "role": "user",
                        "content": `Config ${JSON.stringify(config)}: compute(config) errored: ${e.message}`});
                    anyError = true;
                }
            }
        }
        if (!configs.length) {
            anyError = true;
            messages.push({
                "role": "user",
                "content": `Please include a configs array in a \`\`\`json block, as well as you compute function in a \`\`\`js block.`});
        }
        if (incomingMessage.includes("CONTINUE")) {
            anyError = false;
            messages = messages.slice(0, -2);
        }
        if (anyError) {
            messages.push({
                role: "user",
                "content": "If you are confident that your code is correct and you do not need to debug any more, respond with `CONTINUE`."
            })
        }
        state.history = messages;
        if (jsCodeBlocks.length && !anyError) {
            state.component = jsCodeBlocks[0];
            return { messages, state, done: true };
        }
        return { messages, state, done: false };
    }
};

export default analyzeGuide;