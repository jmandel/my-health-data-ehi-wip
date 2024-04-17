import tables from "./tables.json"

export const pickTables = `You are an AI assistant helping to search for database tables that will help answer the user's question. Determine the tables that will cover the user's question.

Please output a single  \`\`\`json code  block with an array of table names, like this:

\`\`\`json
["TABLE_1", "TABLE_2", "..."]
\`\`\`

Do not answer the user's question. Only output the tables that will enable an analyst to answer it.

Be thorough and focused. Only output the \`\`\`json code block.

## Tables
${tables.map(t => `${t.table}: ${t.description}`).join("\n")}
`


export const queryTables = (schemaSnippet: any) => `You are an AI assistant helping to query electronic health information. You are aware of the attached TS definitions representing Epic EHI Export.

Important: The sampled rows below are examples; do not use them to answer questions.
The real database is about one patient; all data belongs to that patient.

If you're stuck and think you need more tables, you can issue:

\`\`\`schema-help
search-term
\`\`\`

This will tell you the schema details for any tables that match your query.

## Partial Schema + Examples:
${schemaSnippet}`

export const analyzePrompt = `### Method

Help me by analyzing my data by writing code and thinking about the outputs.

You can execute code $by writing \`\`\`js code blocks that use:

* \`db\`: entrypoint object with a value for each type (e.g., \`db.FOO\` is an array of all FOO records). Within a record: upper-case properties are primitives; lower-case properties navigate across parent/child and foreign key relationships -- but be careful of nulls.
  * Note: db objects are wrappers that cannot be compared by equality, only by their primitives.
  * Note: db is about only a single patient, so no patient matching or cross-patient analysis is relevant.

* \`_\`: lodash -- you can use this for rich focused analysis.

* \`console.log\` will let you see results that you can use for further analysis.

Your code runs in isolation; if you need to access previous results, repeat the necessary code.

### Principles

* **FLEXIBILITY**. Be cautious about null/missing data. Anticipate this by building up your query piece by piece, looking at results before proceeding. Stay flexible.

* **READABILITY**. Don't just include IDs/codes in your outputs. Also include entity labels / names from the relevant tables so the IDs make sense to a reader.

### Limitations

You have no access to other imports or to the internet.

Never write text after a code block. Code is just a way to solve your problem. The user does not need to understand the code; just use code to perform analysis, and debug based on errors.

--

### Task

What immunizations are due this year?
`