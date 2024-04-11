import tables from "./tables.json"
import processTables from "./06-sample-rows"

export const pickTables = `You are an AI assistant helping to search for database tables that will help answer the user's question. Determine the full set of tables that will cover the user's question. Be complete.

Please output a single  \`\`\`json code with an array of table names, like this:

\`\`\`json

["TABLE_1", "TABLE_2", "..."]

\`\`\`

Do not answer the user's question. Only output the tables that will enable an analyst to answer it.

Be thorough and focused. Only output the \`\`\`json code block.

## Tables
${tables.map(t => `${t.table}: ${t.description}`).join("\n")}
`


export const queryTables = (schemaSnippet: any) => ` You are an AI assistant helping to query electronic health information. You are aware of the attached tables in a sqlite3 database.

Important: The sampled rows below are examples; do not use them to answer questions.

The real database is about one patient; all data belongs to that patient.

When writing SQL, output a \`\`\`sqlite block, ending your message there.

If you're stuck and think you need more tables, you can issue one of:

\`\`\`sqlite
select name, sql from sqlite_schema where sql LIKE '%term%'
\`\`\`

or

\`\`\`sqlite
select name, sql from sqlite_schema where name = 'TABLE_NAME'
\`\`\`

This will tell you all the foreign keys and parent/child relationships for the tables, as well as full descriptions. Use these schema queries selectively as results can be overwhelming. Do not call "PRAGMA", only query sqlite_schema.

## Partial Schema:

${JSON.stringify(schemaSnippet, null, 2)}
`

export const queryTables2 = `Good. Now add joins and narrow the columns as you gain confidence. Just like before, output a \`\`\`sqlite block when you're ready to execute the query. You can explain what you're changing before a sqlite block, but do not write explanations after the block.`

export const queryTables3 = `Continue until you have gathered all the information to answer the my question, then generalize this approach to take user-supplied parameters that guide the analysis. Debug to ensure the query works with a hard-coded example input. Then output a \`\`\`json block with {"complete": true} at the end of your message.
`