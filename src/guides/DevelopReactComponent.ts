import React from "react";
import { ChatCompletionMessage } from "../models.ts";
import {
  getCodeBlocks,
  queryToRows,
  renderComponentInBackground,
} from "../util";
import { GuideInterface } from "./GuideInterface.ts";
import { transform } from "@babel/standalone";
import _ from "lodash";

export interface DevelopReactComponentState {
  question: string;
  turns: number;
  component: string;
  history: ChatCompletionMessage[];
}

const developReactComponentGuide: GuideInterface<DevelopReactComponentState> = {
  async generateInitialPrompt(
    state: DevelopReactComponentState
  ): Promise<ChatCompletionMessage[]> {
    return [
      ...state.history,
      {
        role: "user",
        content: `Great work. Now create an interactive react component based on compute(). Your component can only access the database through calling compute(config).

Assumption 1. You'll write a component function called "EhiView" start with 

\`\`\`jsx function EhiView() {
  // ... write this whole block
\`\`\`

* You'll have access to \`React\` and \`_\` (lodash), pre-imported as globals. You may not import anything else. 

* You should include compute() in its entirety in your response -- we don't have your old definition anymore.

* there is only one patient record in the system -- it's based on a single patient EHI Export.

* You are writing in pure JS, no TS annotations.

* Add support for user interaction/config, but present something complete and useful by default, never a blank form to be filled out.

* After you output a jsx block, end your message. You do not need to explain it.`
       },
    ];
  },

  async processOutputs(
    incomingMessage: string,
    state: DevelopReactComponentState,
    messages: ChatCompletionMessage[]
  ): Promise<{
    messages: ChatCompletionMessage[];
    state: DevelopReactComponentState;
    done: boolean;
  }> {
    console.log("Got react compoent ex", incomingMessage, "state", state);
    const codeBlock = getCodeBlocks(incomingMessage, "jsx")[0];
    if (codeBlock) {
      state.component = codeBlock
      if (codeBlock.startsWith("import")) {
        messages.push({
          role: "user",
          content: "You may not import anything. Please try again.",
        });
        return { messages, state, done: false };
      }
      try {
        console.log("TESTING CODEBLOCK", codeBlock)
        await renderComponentInBackground(codeBlock);
        return { messages, state, done: true };
      } catch (err: Error) {
        messages.push({
          role: "user",
          content:
            "Your jsx block has an error. Please try again. " +
            err.message + "\n" +
            err.stack
        });
        state.turns += 1;
        if (state.turns > 4) {
            console.log("Failing")
            return { messages, state, done: true };
        }
      }
    }
    if (!codeBlock) {
      messages.push({
        role: "user",
        content:
          "I couldn't find a JSX block in your response. Please try again, and make sure to format your response as a ```jsx code block.",
      });
    }
    console.log("Returning msg", messages.at(-1), "state", state);
    return { messages, state, done: false };
  },
};

export default developReactComponentGuide;
