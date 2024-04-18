import { pickTables } from "../prompts.ts";
import { ChatCompletionMessage } from "../models.ts";
import jsonic from 'jsonic';
import { getCodeBlocks } from "../util";
import { GuideInterface } from "./GuideInterface.ts";

export interface TableExtractionState {
    question: string;
    turns: number;
    tables?: string[];
    failed?: boolean;
}
export const tableExtractionGuide: GuideInterface<TableExtractionState> = {
    async generateInitialPrompt(state: TableExtractionState): Promise<ChatCompletionMessage[]> {
        return [
            {
                role: "system",
                content: pickTables
            },
            {
                role: "user",
                content: state.question
            }
        ];
    },

    async processOutputs(
        incomingMessage: string,
        state: TableExtractionState,
        messages: ChatCompletionMessage[]
    ): Promise<{
        messages: ChatCompletionMessage[];
        state: TableExtractionState;
        done: boolean;
    }> {
        console.log("table processing", incomingMessage, "state", state);
        let codeBlock = getCodeBlocks(incomingMessage, "json")[0] ?? incomingMessage;
        try {
            const tables = jsonic(codeBlock);
            state = { ...state, tables: (state.tables || []).concat(tables) };
            return { messages, state, done: true };
        } catch (e) { }

        state.turns++
        if (state.turns > 3) {
            state.failed = true;
            state.tables = []
            return { messages, state, done: true };
        }
        messages.push({
            role: "user",
            content: "You need to include a ```json block with your response. Containing an array of table names.",
        });
        console.log("Returning msg", messages.at(-1), "state", state);
        return { messages, state, done: false };
    }
};

export default tableExtractionGuide;