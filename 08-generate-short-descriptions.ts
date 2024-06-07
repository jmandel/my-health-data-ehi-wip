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
      console.log("Done", file);
      if (file !== "ORDER_MED.json" && file !== "ORDER_PROC.json")
      continue;
    }
    console.log("Need", file);
    if (path.extname(file) === ".json") {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(outputDir, file);
      const schemaContent = await readFile(inputFilePath, "utf-8");
      const partialWork = await readFile(outputFilePath, "utf-8");
      const schema = JSON.parse(schemaContent);

      // Pare down array values to max 2 entries
      for (const key in schema) {
        if (key !== "$meta" && Array.isArray(schema[key])) {
          schema[key] = schema[key].slice(0, 2);
        }
      }

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",

        max_tokens: 4096,
        temperature: .2,
        system:
          'Your task is to generate concise but complete descriptions of each table and column in the provided database schema. The output should follow the same JSON structure as the input, but replace the existing descriptions with higher-density shorthand versions that convey the core meaning in fewer words.\n\nFor each table, craft a succinct description that captures its primary purpose or the real-world entity it represents. Avoid generic filler phrases like "This table is used to store..." and focus on the essential semantics.\n\nFor each column, generate a condensed description that specifies the column\'s meaning, role within the table, and any key traits like data type, constraints, or relationships to other columns. Omit any redundant or non-essential details.\n\nThe goal is to produce descriptions that are as information-dense as possible while still being clear and complete. Do not use any jargon, but instead focus on plain and widely recognized terms. Imagine explaining the schema to a knowledgeable clinical user in as few words as possible.\n\nPlease output the result using the original JSON schema structure, only including the table name, table description, column name, and column description, with the original names and replacing "description" fields with your generated high-density versions.\n\nOutput a single JSON object with no commentary. Output only the schema contents. The included sample data are just to help you understand the content.',
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: '{\n  "$meta": {\n    "schemas": {\n      "CLARITY_HM_TOPIC": {\n        "name": "CLARITY_HM_TOPIC",\n        "description": "The CLARITY_HM_TOPIC table contains the names and IDs of your health maintenance topic records. These records include tests and procedures that form the basis for Health Maintenance plans in clinical system.",\n        "primaryKey": [\n          {\n            "columnName": "HM_TOPIC_ID",\n            "ordinalPosition": 1\n          }\n        ],\n        "columns": [\n          {\n            "ordinalPosition": 1,\n            "name": "HM_TOPIC_ID",\n            "type": "NUMERIC",\n            "discontinued": false,\n            "description": "The unique ID of the health maintenance topic record."\n          },\n          {\n            "ordinalPosition": 2,\n            "name": "NAME",\n            "type": "VARCHAR",\n            "discontinued": false,\n            "description": "The name of the health maintenance topic."\n          }\n        ]\n      }\n    }\n  },\n  "CLARITY_HM_TOPIC": [\n    {\n      "HM_TOPIC_ID": 4,\n      "NAME": "Meningococcal B Vaccine",\n      "$meta": {\n        "type": "CLARITY_HM_TOPIC"\n      }\n    },\n    {\n      "HM_TOPIC_ID": 9,\n      "NAME": "Lab-Diabetes Screening",\n      "$meta": {\n        "type": "CLARITY_HM_TOPIC"\n      }\n    },',
              },
            ],
          },
          {
            role: "assistant",
            content: [
              {
                type: "text",
                text: '{\n  "$meta": {\n    "schemas": {\n      "CLARITY_HM_TOPIC": {\n        "name": "CLARITY_HM_TOPIC",\n        "description": "Health maintenance topics for tests and procedures",\n        "columns": [\n          {\n            "name": "HM_TOPIC_ID",\n            "description": "Unique health topic identifier" \n          },\n          {\n            "name": "NAME",\n            "description": "Health topic name"\n          }\n        ]\n      }\n    }\n  }\n}',
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: JSON.stringify(schema, null, 2),
              },
            ],
          },{
            role: "assistant",
            content: [
              {
                type: "text",
                text: partialWork
              },
            ],
          }
        ],
      });

      await writeFile(outputFilePath, partialWork + response.content[0].text, "utf-8");
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
