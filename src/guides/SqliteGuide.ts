import { queryTables, queryTables2, queryTables3 } from "../prompts.ts";
import { ChatCompletionMessage } from "../models.ts";
import jsonic from "jsonic";
import { getCodeBlocks, queryToRows, queryToString } from "../util";
import { GuideInterface } from "./GuideInterface.ts";
import { identity } from "lodash";
import processTables from "../06-sample-rows.ts";

export interface SqliteGuideState {
  turns: number;
  history?: ChatCompletionMessage[];
  queries?: string[];
  failed?: boolean;
}

const sqliteGuide: GuideInterface<SqliteGuideState> & { checkSql: any } = {
  async checkSql(incomingMessage: string): {
    messages: ChatCompletionMessage[];
    ok: boolean | null;
  } {
    let ok = null;
    const messages: ChatCompletionMessage[] = [];
    for (const b of getCodeBlocks(incomingMessage, "sql", "sqlite")) {
      const resb = await queryToString(b);
      if (resb[1] === "error") {
        ok = false;
        messages.push({
          role: "user",
          content: `SQL query result:\n${resb[0]}\n`,
        });
      } else if (resb[0].length === 0) {
        ok = false;
        messages.push({
          role: "user",
          content: "SQL query result was empty.",
        });
      } else if (ok === null) {
        ok = true;
      }
    }
    return { messages, ok };
  },
  async generateInitialPrompt(
    state: SqliteGuideState
  ): ChatCompletionMessage[] {
    const r = await this.checkSql(state.history?.at(-1)?.content);
    if (r.ok) {
      state.queries = getCodeBlocks(
        state.history?.at(-1)?.content!,
        "sql",
        "sqlite"
      );
      return [];
    }
    return [...(state.history || []), ...r.messages];
  },
  async processOutputs(
    incomingMessage: string,
    state: SqliteGuideState,
    messages: ChatCompletionMessage[]
  ): Promise<{
    messages: ChatCompletionMessage[];
    state: SqliteGuideState;
    done: boolean;
  }> {
    console.log("schema processing", incomingMessage, "state", state);
    const r = this.checkSql(incomingMessage);
    if (r.ok) {
      state.queries = getCodeBlocks(incomingMessage, "sql", "sqlite");
      return { messages, state, done: true };
    }

    state.turns += 1;
    if (state.turns > 3) {
      state.failed = true;
      return { messages, state, done: true };
    }

    if (r.ok === null) {
      messages = [
        ...messages,
        {
          role: "user",
          content: "Please provide a ```sqlite code block",
        },
      ];
    } else if (r.ok === false) {
      messages = [
        ...messages,
        {
          role: "user",
          content: "Your SQL query had errors. Please try again.",
        },
        ...r.messages,
      ];
    }

    return { messages, state, done: false };
  },
};

export default sqliteGuide;
