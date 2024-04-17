import { ChatCompletionMessage } from "../models.ts";


export interface GuideInterface<State> {
    generateInitialPrompt(state: State): Promise<ChatCompletionMessage[]>;
    processOutputs(incomingMessage: string, state: State, messages: ChatCompletionMessage[]): Promise<{
        messages: ChatCompletionMessage[];
        state: State;
        done: boolean;
    }>;
}
