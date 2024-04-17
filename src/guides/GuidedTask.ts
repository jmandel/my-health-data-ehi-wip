import { LLMWrapper, ChatCompletionMessage } from "../models.ts";
import { GuideInterface } from "./GuideInterface.ts";

export class GuidedTask<State> {
    private llm: LLMWrapper;
    private guide: GuideInterface<State>;
    private state: State;

    constructor(llm: LLMWrapper, guide: GuideInterface<State>, initialState: State) {
        this.llm = llm;
        this.guide = guide;
        this.state = initialState;
    }

    async run(): Promise<State> {
        let conversationMessages: ChatCompletionMessage[] = await this.guide.generateInitialPrompt(this.state);
        let done = conversationMessages.length === 0;

        while (!done) {
            const response = await this.llm.createChatCompletion({
                temperature: 0.8,
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
