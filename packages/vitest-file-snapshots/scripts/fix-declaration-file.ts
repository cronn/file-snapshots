import * as fs from "node:fs";

const generatedDeclarationFile = "./dist/register.d.ts";

if (!fs.existsSync(generatedDeclarationFile)) {
  throw new Error("Declaration file does not exist.");
}

/**
 * Import Vitest at the start of the file
 *
 * This ensures that the module augmentation for the custom matchers
 * happens after the Vitest types are declared
 */
const declaration = fs.readFileSync(generatedDeclarationFile);
fs.writeFileSync(generatedDeclarationFile, `import "vitest";\n${declaration}`);

console.log("Fixed module augmentation in declaration file.");
