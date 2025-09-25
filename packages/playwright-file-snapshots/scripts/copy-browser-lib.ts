import fs from "node:fs";

const sourceFile =
  "./node_modules/@cronn/element-snapshot/dist/index.global.js";
const targetFile = "./dist/element-snapshot.js";

if (!fs.existsSync(sourceFile)) {
  throw new Error(`File '${sourceFile} is missing`);
}

fs.copyFileSync(sourceFile, targetFile);

console.log("Copied browser library to /dist.");
