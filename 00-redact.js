import * as fs from 'fs'; 
import minimist from 'minimist';

function generateRedactionRegex(term) {
  const chars = term.replace(/\s+/g, "").split('');
  const pattern = chars.join("[\-_()\\[\\]\\{\\}\\s]{0,5}");
  return new RegExp(pattern, 'gi');
}

async function redactTsv(tsvFile, redactionTerms) {
  const contents = await fs.promises.readFile(tsvFile, 'utf-8');
  let redactedContents = contents;

  for (const term of redactionTerms) {
    const regex = generateRedactionRegex(term);
    redactedContents = redactedContents.replace(regex, "REDACTED");
  }

  await fs.promises.writeFile(tsvFile, redactedContents); 
}

async function main() {
  const args = minimist(process.argv.slice(2));

  const directory = args.directory || 'tsv'; 
  const termsFile = args.terms || '.redaction-terms.json';
  const inlineTerms = args.inline;

  let redactionTerms = [];
  if (termsFile) {
    redactionTerms = JSON.parse(await fs.promises.readFile(termsFile, 'utf-8'));
  }

  if (inlineTerms) {
    redactionTerms.push(...inlineTerms.map(String));
  }
  console.log("T", redactionTerms);
  if (!redactionTerms.length) {
    throw "No terms found"
  }

  const files = await fs.promises.readdir(directory);

  for (const file of files) {
    if (file.endsWith(".tsv")) {
      await redactTsv(directory + '/' + file, redactionTerms); // Construct full file path
    }
  }
}

main();

