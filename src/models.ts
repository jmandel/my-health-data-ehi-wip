import { OpenAI } from "openai";
import { sha } from "bun";
export interface LLMWrapper {
  createChatCompletion(args: ChatCompletionCreateParams, onChunk?: (chunk: string) => void): Promise<ChatCompletionMessage>;
}

export interface ChatCompletionCreateParams {
  messages: ChatCompletionMessage[];
  temperature?: number;
  model?: string;
}

export interface ChatCompletionMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface NonSystemChatMessage {
    role: "user" | "assistant";
    content: string;
}



interface OpenAIWrapperConfig {
  apiKey?: string;
  cachePrefix: string;
  seed?: string | null;
  maxTokens?: number;
  maxTries?: number;
  maxConcurrentRequests?: number;
  defaultModel?: string;
  baseUrl?: string;
}


export async function hashWithSHA256(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export class OpenAIWrapper implements LLMWrapper {
  private openai: OpenAI;
  private cachePrefix: string;
  private seed: string | null;
  private maxConcurrentRequests: number;
  private maxTries: number;
  private currentRequests: number;
  private requestQueue: Array<() => void>;
  private rateLimited: boolean;
  private defaultModel: string;

  //   constructor(apiKey: string, cachePrefix: string, seed: string | null = null, maxConcurrentRequests: number = 5, maxRetries: number = 3) {
  constructor(config: OpenAIWrapperConfig) {
    this.openai = new OpenAI({
      apiKey: config.apiKey || "",
      baseURL: config.baseUrl || "https://api.openai.com/v1",
      dangerouslyAllowBrowser: true,
    });

    this.cachePrefix = config.cachePrefix;
    this.seed = config.seed || null;
    this.maxConcurrentRequests = config.maxConcurrentRequests || 1;
    this.maxTries = config.maxTries || 1;
    this.currentRequests = 0;
    this.requestQueue = [];
    this.rateLimited = false;
    this.defaultModel = config.defaultModel || "gpt-4-turbo-v";
  }

  private async processQueue() {
    if (
      this.currentRequests < this.maxConcurrentRequests &&
      this.requestQueue.length > 0
    ) {
      const request = this.requestQueue.shift();
      this.currentRequests++;
      await request!();
      this.currentRequests--;
      this.processQueue();
    }
  }

  async createChatCompletion(
    args: ChatCompletionCreateParams,
    onChunk?: (chunk: string) => void
  ): Promise<ChatCompletionMessage> {
    const model = args.model || this.defaultModel;
    const cacheKeyBase = this.seed
      ? `${model}_${this.cachePrefix}_${this.seed}_${JSON.stringify(args)}`
      : null;

    // hash the messages to create a unique cache key. Use SHA-256;
    const cacheKey = cacheKeyBase ? await hashWithSHA256(cacheKeyBase) : null;
    if (cacheKey && typeof localStorage !== "undefined")
    {
      const cachedResponse = localStorage.getItem(cacheKey);
      if (cachedResponse) {
        return JSON.parse(cachedResponse);
      }
    }

    return new Promise((resolve, reject) => {
      const request = async () => {
        let tries = 0;
        while (tries < this.maxTries) {
          try {
            console.log("API SEND");
            const stream = await this.openai.chat.completions.create({
              model,
              messages: args.messages,
              temperature: args.temperature,
              stop: ["```\n"],
              stream: true
            });
            let message = "";
            for await (const chunk of stream) {
              const chunkString = chunk.choices[0]?.delta?.content || ''
              // console.log("Chunk", chunkString)
              chunkString && onChunk?.(chunkString)
              message += chunkString
            }

            console.log("API RECEIVE", message);
            if (
              Array.from(message?.matchAll(/```/g) || []).length % 2 !==
              0
            ) {
              message += "```\n";
            }
            const result = { role: "assistant", content: message} as ChatCompletionMessage
            if (cacheKey && result && typeof localStorage !== "undefined") {
              localStorage.setItem(cacheKey, JSON.stringify(result));
            }
            resolve(result);
            break;
          } catch (error: any) {
            console.error("API ERROR", error);
            if (error.type === "tokens") {
              console.log(
                "SPLICING OUT CONTENT TO SHORTER",
                args.messages.length,
                "messages"
              );
              args.messages.splice(1, args.messages.length - 2);
              console.log("NOW SLICED TO", args.messages.length, "messages");
            }
            if (error.status === 429 && tries < this.maxTries - 1) {
              this.rateLimited = true;
              const backoffTime = 2 ** tries * 5000;
              console.warn(
                `Rate limit exceeded. Retrying in ${backoffTime}ms...`
              );
              await new Promise((resolve) => setTimeout(resolve, backoffTime));
            } else {
              reject(error);
              break;
            }
            if (tries === this.maxTries - 1) {
              reject(
                new Error("Max retries exceeded. Please try again later.")
              );
            }
            tries++;
          }
        }
      };

      this.requestQueue.push(request);
      if (!this.rateLimited) {
        this.processQueue();
      } else {
        setTimeout(() => {
          this.rateLimited = false;
          this.processQueue();
        }, 60000);
      }
    });
  }
}