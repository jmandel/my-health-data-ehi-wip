import { query as queryIter } from "./ehi.ts";
import { transform } from '@babel/standalone';
import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {db} from './client.ts'
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

export function getCodeBlocks(message: string, ...tags: string[]): string[] {
    return tags.flatMap(tag => {
        const codeBlockRegex = new RegExp(`\`\`\`${tag}\n([\\s\\S]*?)\`\`\``, "g");
        const matches = message.matchAll(codeBlockRegex);
        return Array.from(matches, (match) => match[1]);
    });
}
export function chunk<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

export const queryOverride = {
    queryIter: null
};

type SuccessStatus = "success" | "error";
export async function queryToString(sql: string): Promise<[string, SuccessStatus]> {
    console.log(`Executing SQL query: ${sql}`);
    try {
        const ret = (await Array.fromAsync((queryOverride.queryIter || queryIter)(sql))).map(row => JSON.stringify(row).slice(0, 2000) + (JSON.stringify(row).length > 2000 ? "...<truncated>" : "")).join("\n");
        console.log(`Query result: ${ret.slice(0, 100000) + (ret.length > 100000 ? "...<truncated>" : "")}`);
        return [ret, 'success'];
    } catch (error: any) {
        console.log(`Query Error: ${error.message}`);
        return [`Error: ${error.message}`, 'error'];
    }
}

export async function queryToRows(sql: string, params:any = []): Promise<Record<string, string|number|boolean|null>[]>   {
    console.log(`Executing SQL query: ${sql}`);
    const ret =  (await Array.fromAsync((queryOverride.queryIter || queryIter)(sql, params)))
    console.log("Query result", ret);
    return ret;
}


export const renderComponentInBackground = (componentCode: string) => {
    const transpiledCode = transform(componentCode, {
      presets: ['react'],
    }).code;

    let root, container;
    return new Promise((resolve, reject)=>{
        errorEmitter.on('error', (error) => {
            reject(error);
        });

        try {
 
            const evalComponent = new Function('React', '_', 'db', transpiledCode + " return EhiView;");
            const NewComponent = evalComponent(React, _, db);
            container = document.createElement('div');
            root = createRoot(container);
            console.log("ROOT", container, root)
            root.render(<ErrorBoundary>
                <NewComponent query={queryToRows}/>
            </ErrorBoundary>)
        } catch(e) {done = true; reject(e);}
        setTimeout(() => {
            try {
                root!.unmount();
                container!.remove();
                resolve(true)
            } catch(e) {
                reject(e);
            }
        }, 100)
    })
};

// error EventTarget class
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  // TODO: off ;-)

  on(eventName, listener) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  emit(eventName, ...args) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listener => listener(...args));
    }
  }
}

const errorEmitter = new EventEmitter();

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    errorEmitter.emit('error', error);
    return { hasError: error.message };
  }

  componentDidCatch(error, info) {
    // logErrorToMyService(error, info.componentStack);
  }

       resetErrorBoundary() {
       this.setState({ hasError: false });
     }

       componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
          this.setState({ hasError: false });
        }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return JSON.stringify(this.state.hasError)
    }

    return this.props.children;
  }
}


export function runCode(db, code: string) {
  const f = new Function("console", "db", "_", code);
  db.errors.clear()
  const consoleLogs = [] as any[]
  try {
    f({log: (...args) => {consoleLogs.push(args.map(x => x?.__proxy ?  JSON.stringify(x) : typeof x === "object" ? JSON.stringify(x): x))}}, db, _);
  } catch (e) {
    db.errors.add(e.message.toString())
  }

  const ret = {
    errors: db.errors,
    logs: consoleLogs
  }

  console.log("runcode", ret)
  return ret
}