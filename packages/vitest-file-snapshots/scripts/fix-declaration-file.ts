import * as fs from "node:fs";

const generatedDeclarationFile = "./dist/register.d.mts";

if (!fs.existsSync(generatedDeclarationFile)) {
  throw new Error("Declaration file does not exist.");
}

function addVitestSideEffectImport(declaration: string): string {
  return `import "vitest";\n${declaration}`;
}

/**
 * Import Vitest at the start of the file
 *
 * This ensures that the module augmentation for the custom matchers
 * happens after the Vitest types are declared
 */
const declaration = fs.readFileSync(generatedDeclarationFile).toString();
fs.writeFileSync(
  generatedDeclarationFile,
  addVitestSideEffectImport(declaration),
);

console.log("Fixed declaration file.");
