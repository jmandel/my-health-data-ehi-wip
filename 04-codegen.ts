import {generateInterfaces } from './src/codegen'
const ehiFile = Bun.file('ehi-merged.json');
const ehi = await ehiFile.json();
const result = generateInterfaces(ehi.$meta.schemas);
console.log(result);