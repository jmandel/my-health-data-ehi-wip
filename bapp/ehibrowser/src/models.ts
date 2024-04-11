import { OpenAI } from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { sha } from "bun";
export interface LLMWrapper {
  createChatCompletion(args: ChatCompletionCreateParams): Promise<ChatCompletionMessage>;
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

interface ClaudeWrapperConfig {
  apiKey: string;
  cachePrefix: string;
  seed?: string | null;
  maxTokens?: number;
  defaultModel?: string;
}


export class ClaudeWrapper implements LLMWrapper {
  private anthropic: Anthropic;
  private cachePrefix: string;
  private seed: string | null;
  private maxTokens: number;
  private defaultModel: string;

  constructor(config: ClaudeWrapperConfig) {
    this.anthropic = new Anthropic({ apiKey: config.apiKey });
    this.cachePrefix = config.cachePrefix;
    this.seed = config.seed || null;
    this.maxTokens = config.maxTokens || 2000;
    this.defaultModel = config.defaultModel || "claude-3-sonnet-20240229";
  }

  async createChatCompletion(args: ChatCompletionCreateParams): Promise<ChatCompletionMessage> {
    const cacheKey = this.seed ? `${this.cachePrefix}_${this.seed}_${JSON.stringify(args)}` : null;
    if (cacheKey) {
      const cachedResponse = localStorage.getItem(cacheKey);
      if (cachedResponse) {
        return JSON.parse(cachedResponse);
      }
    }

    function toNonSystemMessages(messages: ChatCompletionMessage[]): NonSystemChatMessage[] {
      return messages.filter(m => m.role !== "system") as NonSystemChatMessage[];
    }

    try {
      const response = await this.anthropic.messages.create({
        system: args.messages.filter(m => m.role === "system").map(m => m.content).at(0),
        model: args.model || this.defaultModel,
        messages: toNonSystemMessages(args.messages),
        temperature: args.temperature,
        max_tokens: this.maxTokens
      });
      const result: ChatCompletionMessage = {
        ...response,
        content: response.content.map(b => b.text).join("\n\n")
      };
      if (cacheKey) {
        console.log("Set storag", cacheKey, "to", JSON.stringify(result).slice(0, 100));
        localStorage.setItem(cacheKey, JSON.stringify(result));
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

interface OpenAIWrapperConfig {
  apiKey: string;
  cachePrefix: string;
  seed?: string | null;
  maxTokens?: number;
  maxRetries?: number;
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
  private maxRetries: number;
  private currentRequests: number;
  private requestQueue: Array<() => void>;
  private rateLimited: boolean;
  private defaultModel: string;

//   constructor(apiKey: string, cachePrefix: string, seed: string | null = null, maxConcurrentRequests: number = 5, maxRetries: number = 3) {
  constructor(config: OpenAIWrapperConfig) {
    this.openai = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl || "https://api.openai.com/v1",
        dangerouslyAllowBrowser: true
    });

    this.cachePrefix = config.cachePrefix;
    this.seed = config.seed || null;
    this.maxConcurrentRequests = config.maxConcurrentRequests || 1;
    this.maxRetries = config.maxRetries || 3;
    this.currentRequests = 0;
    this.requestQueue = [];
    this.rateLimited = false;
    this.defaultModel = config.defaultModel || "gpt-4-turbo-v";
  }

  private async processQueue() {
    if (this.currentRequests < this.maxConcurrentRequests && this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      this.currentRequests++;
      await request!();
      this.currentRequests--;
      this.processQueue();
    }
  }

  
  async createChatCompletion(args: ChatCompletionCreateParams): Promise<ChatCompletionMessage> {
    const cacheKeyBase = this.seed ? `${this.cachePrefix}_${this.seed}_${JSON.stringify(args)}` : null;

    // hash the messages to create a unique cache key. Use SHA-256.
    const cacheKey  =  cacheKeyBase ? await hashWithSHA256(cacheKeyBase) : null;
    if (cacheKey && typeof localStorage !== 'undefined') {
      const cachedResponse = localStorage.getItem(cacheKey);
      if (cachedResponse) {
        return JSON.parse(cachedResponse);
      }
    }

    return new Promise((resolve, reject) => {
      const request = async () => {
        let retries = 0;
        while (retries < this.maxRetries) {
          try {
            console.log("API SEND");
            const response = await this.openai.chat.completions.create({
              model: args.model || this.defaultModel,
              messages: args.messages,
              temperature: args.temperature,
            });
            console.log("API RECEIVE", response);
            const result = response.choices[0].message;
            if (cacheKey && result && typeof localStorage !== 'undefined') {
              localStorage.setItem(cacheKey, JSON.stringify(result));
            }
            resolve(result as ChatCompletionMessage);
            break;
          } catch (error: any) {
            console.error("API ERROR", error);
            if (error.type === 'tokens') {
              console.log("SPLICING OUT CONTENT TO SHORTER", args.messages.length, "messages");
              args.messages.splice(1, args.messages.length - 2);
              console.log("NOW SLICED TO", args.messages.length, "messages");
            }
            if (error.status === 429) {
              this.rateLimited = true;
              const backoffTime = 2 ** retries * 5000;
              console.warn(`Rate limit exceeded. Retrying in ${backoffTime}ms...`);
              await new Promise((resolve) => setTimeout(resolve, backoffTime));
            } else {
              reject(error);
              break;
            }
            if (retries === this.maxRetries - 1) {
              reject(new Error("Max retries exceeded. Please try again later."));
            }
            retries++;
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