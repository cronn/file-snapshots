import * as fs from "node:fs";

const generatedDeclarationFile = "./dist/register.d.ts";

if (!fs.existsSync(generatedDeclarationFile)) {
  throw new Error("Declaration file does not exist.");
}

function addVitestSideEffectImport(declaration: string): string {
  return `import "vitest";\n${declaration}`;
}

function removeSelfSideEffectImport(declaration: string): string {
  return declaration.replace("import '@cronn/lib-file-snapshots';\n", "");
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
  addVitestSideEffectImport(removeSelfSideEffectImport(declaration)),
);

console.log("Fixed declaration file.");
