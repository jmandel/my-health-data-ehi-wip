import { Anthropic } from "@anthropic-ai/sdk";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import yargs from "yargs";

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

async function processSchemaFiles(inputDir: string, outputDir: string) {
  const files = await readdir(inputDir);
  const outFiles = await readdir(outputDir);
  for (const file of files) {
    if (outFiles.includes(file)) {
        console.log("Done", file)
    }
    console.log("Need", file)
    if (path.extname(file) === ".json") {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, file);
      const schemaContent = await readFile(inputFilePath, "utf-8");
      const schema = JSON.parse(schemaContent);

      // Pare down array values to max 2 entries
      for (const key in schema) {
        if (key !== "$meta" && Array.isArray(schema[key])) {
          schema[key] = schema[key].slice(0, 2);
        }
      }

      const response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
  max_tokens: 4000,
  temperature: 0,
  system: "Your task is to generate concise but complete descriptions of each table and column in the provided database schema. The output should follow the same JSON structure as the input, but replace the existing descriptions with higher-density shorthand versions that convey the core meaning in fewer words.\n\nFor each table, craft a succinct description that captures its primary purpose or the real-world entity it represents. Avoid generic filler phrases like \"This table is used to store...\" and focus on the essential semantics.\n\nFor each column, generate a condensed description that specifies the column's meaning, role within the table, and any key traits like data type, constraints, or relationships to other columns. Omit any redundant or non-essential details.\n\nThe goal is to produce descriptions that are as information-dense as possible while still being clear and complete. Imagine explaining the schema to a knowledgeable database user in as few words as possible.\n\nPlease output the result using the original JSON schema structure, only including the table name, table description, column name, and column description, with the original names and  replacing \"description\" fields with your generated high-density versions.\n\nOutput a single JSON object with no commentary. Output only the schema contents. The included sample data are just to help you understand the content.",
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "{\n  \"$meta\": {\n    \"schemas\": {\n      \"ORDER_SUMMARY\": {\n        \"name\": \"ORDER_SUMMARY\",\n        \"description\": \"Contains the summary for an order that has been signed.\",\n        \"primaryKey\": [\n          {\n            \"columnName\": \"ORDER_ID\",\n            \"ordinalPosition\": 1\n          },\n          {\n            \"columnName\": \"LINE\",\n            \"ordinalPosition\": 2\n          }\n        ],\n        \"columns\": [\n          {\n            \"ordinalPosition\": 1,\n            \"name\": \"ORDER_ID\",\n            \"type\": \"NUMERIC\",\n            \"discontinued\": false,\n            \"description\": \"The unique identifier for the order record.\"\n          },\n          {\n            \"ordinalPosition\": 2,\n            \"name\": \"LINE\",\n            \"type\": \"INTEGER\",\n            \"discontinued\": false,\n            \"description\": \"Line number of each line in multiple responses in a signed order summary.\"\n          },\n          {\n            \"ordinalPosition\": 3,\n            \"name\": \"ORD_SUMMARY\",\n            \"type\": \"VARCHAR\",\n            \"discontinued\": false,\n            \"description\": \"The summary sentence for the order.\"\n          }\n        ],\n        \"discoveredMappings\": [\n          {\n            \"type\": \"has-child-table\",\n            \"source\": \"ORDER_SUMMARY\",\n            \"target\": \"ORDER_RPTD_SIG_INSTR\",\n            \"joinKeys\": [\n              {\n                \"source\": \"ORDER_ID\",\n                \"target\": \"ORDER_ID\"\n              },\n              {\n                \"source\": \"LINE\",\n                \"target\": \"GROUP_LINE\"\n              }\n            ]\n          },\n          {\n            \"type\": \"has-parent-table\",\n            \"source\": \"ORDER_SUMMARY\",\n            \"target\": \"ORDER_PROC\",\n            \"joinKeys\": [\n              {\n                \"source\": \"ORDER_ID\",\n                \"target\": \"ORDER_PROC_ID\"\n              }\n            ]\n          },\n          {\n            \"type\": \"has-parent-table\",\n            \"source\": \"ORDER_SUMMARY\",\n            \"target\": \"ORDER_MED\",\n            \"joinKeys\": [\n              {\n                \"source\": \"ORDER_ID\",\n                \"target\": \"ORDER_MED_ID\"\n              }\n            ]\n          }\n        ]\n      }\n    }\n  },\n  \"ORDER_SUMMARY\": [\n    {\n      \"ORDER_ID\": 439060604,\n      \"LINE\": 1,\n      \"ORD_SUMMARY\": \"Lab Collect, Future, Expected: 8/9/2018, Expires: 9/8/2018, Qty-1\",\n      \"$meta\": {\n        \"type\": \"ORDER_SUMMARY\"\n      }\n    },\n    {\n      \"ORDER_ID\": 439060605,\n      \"LINE\": 1,\n      \"ORD_SUMMARY\": \"Lab Collect, Future, Expected: 8/9/2018, Expires: 9/8/2018, Qty-1\",\n      \"$meta\": {\n        \"type\": \"ORDER_SUMMARY\"\n      }\n    },\n    {\n      \"ORDER_ID\": 439060606,\n      \"LINE\": 1,\n      \"ORD_SUMMARY\": \"Lab Collect, Qty-1\",\n      \"$meta\": {\n        \"type\": \"ORDER_SUMMARY\"\n      }\n    }\n  ]\n}"
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "{\n  \"$meta\": {\n    \"schemas\": {\n      \"ORDER_SUMMARY\": {\n        \"name\": \"ORDER_SUMMARY\",\n        \"description\": \"Signed order summary\",\n        \"columns\": [\n          {\n            \"name\": \"ORDER_ID\",\n            \"description\": \"Unique order ID\"\n          },\n          {\n            \"name\": \"LINE\",\n            \"description\": \"Summary line number for multi-line orders\"\n          },\n          {\n            \"name\": \"ORD_SUMMARY\",\n            \"description\": \"Order summary text\"\n          }\n        ]\n      }\n    }\n  }\n}"
        }
      ]
    },
    {
            role: "user",
            content: [{
                type: "text",
                "text": JSON.stringify(schema, null, 2),
            }]
          },
        ],
      });

      await writeFile(outputFilePath, response.content[0].text, "utf-8");
      console.log(`Processed file: ${file}`);
    }
  }
}

import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 --input-dir [string] --output-dir [string]")
  .option("input-dir", {
    describe: "Input directory containing JSON schema files",
    demandOption: true,
    type: "string",
  })
  .option("output-dir", {
    describe: "Output directory to store processed JSON files",
    demandOption: true,
    type: "string",
  })
  .help()
  .alias("help", "h").argv;

processSchemaFiles(argv["input-dir"], argv["output-dir"]);