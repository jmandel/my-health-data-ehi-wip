import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { parse, format } from 'date-fns';
import { parse as parseCsv } from 'csv-parse/sync';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const loadSchema = async (filePath) => {
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error loading schema: ${e}`);
    return null;
  }
};

const validateEntry = (value, entries) => entries.includes(value);

const parseValue = (value, column, typeName) => {
  const columnType = column.type;
  const { entries } = column;
  const trimmedValue = value.trim();
  let parsedValue = trimmedValue;

  if (!trimmedValue) {
    return [null, true];
  }

  try {
    if (columnType.startsWith('DATETIME')) {
      const dateValue = parse(trimmedValue, 'M/d/yyyy h:mm:ss a', new Date());
      parsedValue = format(dateValue, 'yyyy-MM-dd HH:mm:ss');
    } else if (columnType === 'INTEGER') {
      parsedValue = trimmedValue ? parseInt(trimmedValue) : 0;
    } else if (columnType === 'NUMERIC') {
      parsedValue = trimmedValue ? parseFloat(trimmedValue) : 0;
    } else if (columnType === 'FLOAT') {
      parsedValue = parseFloat(trimmedValue);
    }
  } catch (e) {
    console.error(`Error parsing ${typeName}.${column.name} (${column.description}) value: ${trimmedValue} for column type: ${columnType}, error: ${e}`);
  }

  const validationPassed = entries ? validateEntry(parsedValue, entries) : true;
  if (!validationPassed){
    console.error(`Enum Validation failed on ${value} (matches none of ${column.entries.length} expected values)`, typeName)
  }
  return [parsedValue, validationPassed];

};

const processTsvData = async (schema, tsvFilePath, typeName, database) => {
  try {
    const tsvData = await readFile(tsvFilePath, 'utf-8');
    const records = parseCsv(tsvData, { columns: true, delimiter: '\t', quote: null});

    records.forEach((row) => {
      const processedRow = {};
      const validationInfo = {};

      schema.columns.forEach((column) => {
        const colName = column.name;
        const [value, isValid] = parseValue(row[colName] || '', column, typeName);

        if (value !== null) {
          processedRow[colName] = value;
        }
        if (column.entries) {
          validationInfo[colName] = isValid;
        }
      });

      // const rowMeta = { type: typeName, validation: validationInfo };
      const rowMeta = { type: typeName};
      processedRow.$meta = rowMeta;
      database[typeName].push(processedRow);
    });
  } catch (e) {
    console.error(`Error processing TSV data: ${e}`);
  }
};

const main = async () => {
  const argv = yargs(hideBin(process.argv))
    .option('schemaFolder', {
      description: 'Path to the folder containing JSON schema files',
      default: './schemas/',
      type: 'string',
    })
    .option('tsvFolder', {
      description: 'Path to the folder containing TSV data files',
      default: './tsv/',
      type: 'string',
    })
    .option('outputFile', {
      description: 'Output JSON file',
      default: 'ehi.json',
      type: 'string',
    })
    .help()
    .alias('help', 'h').argv;

  const { schemaFolder, tsvFolder, outputFile } = argv;
  const database = { $meta: { schemas: {} } };

  const errors = [];
  const files = await readdir(tsvFolder);
  for (const fileName of files) {
    if (fileName.endsWith('.tsv')) {
      const typeName = fileName.slice(0, -4);
      const schemaPath = join(schemaFolder, `${typeName}.json`);
      const tsvFilePath = join(tsvFolder, `${typeName}.tsv`);

      try {
        await readFile(tsvFilePath);
        const schema = await loadSchema(schemaPath);
        if (schema) {
          database.$meta.schemas[typeName] = schema;
          database[typeName] = [];

          await processTsvData(schema, tsvFilePath, typeName, database);

          const cols = new Set(database[typeName].flatMap(Object.keys));
          database.$meta.schemas[typeName].columns = schema.columns.filter(
            (c) => cols.has(c.name)
          );
        }
      } catch (e) {
        errors.push(e)
        console.error(`Error processing file ${tsvFilePath}: ${e}`);
      }
    }
  }

  const jsonData = JSON.stringify(database, null, 2);
  await writeFile(outputFile, jsonData, 'utf-8');
  console.error("Errors", errors);
};

main();
