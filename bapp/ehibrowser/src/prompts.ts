import tables from "./tables.json"

export const pickTables = `You are an AI assistant helping to search for database tables that will help answer the user's question. Determine the set of tables that will cover the user's question. Be complete.

Please output a single  \`\`\`json code with an array of table names, like this:

\`\`\`json

["TABLE_1", "TABLE_2", "..."]

\`\`\`

Do no answer the user's question. Only output the tables needed to answer it; these tables will be made available for downstream processing.

Be thorough and focused. Only output the \`\`\`json code block.

## Tables
${tables.map(t => `${t.table}: ${t.description}`).join("\n")}
`