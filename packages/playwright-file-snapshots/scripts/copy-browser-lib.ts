import fs from "node:fs";

const sourceFile = "./node_modules/@cronn/dom-snapshot/dist/index.global.js";
const targetFile = "./dist/dom-snapshot.js";

if (!fs.existsSync(sourceFile)) {
  throw new Error(`File '${sourceFile} is missing`);
}

fs.copyFileSync(sourceFile, targetFile);

console.log("Copied browser library to /dist.");
