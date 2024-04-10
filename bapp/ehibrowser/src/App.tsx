import { useEffect, useState } from 'react'
import './App.css'
import * as agent from "./agent.ts"
console.log(agent)

// import * as agent from "./agent"
// console.log(agent.v)

import EhiView from "./EhiView.jsx";

function App() {
  console.log("App mount")
  const [count, setCount] = useState(0)
  useEffect(() => {
    (async () => {
      const result = await query("SELECT * FROM sqlite_master");
      console.log("Result", result)
    })()
  }, [])

  return (
    <>
      <h1>EHI Demo</h1>
      
      <div>
        <a href="https://github.com/jmandel/ehi-exploration" target="_blank">github.com/jmandel/ehi-exploration </a>
      </div>
      <EhiView query={query}></EhiView>
    </>
  )
}

import {query as queryIter} from "./ehi.ts";
async function query(sql: string, params:any = []): Promise<Record<string, any>[]>   {
    console.log(`Executing SQL query: ${sql}`);
    const ret =  (await Array.fromAsync(queryIter(sql, params)))
    console.log("Query result", ret);
    return ret;
}


export default App
