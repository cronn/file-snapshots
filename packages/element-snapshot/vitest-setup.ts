import { registerValidationFileMatchers } from "@cronn/vitest-file-snapshots/register";

registerValidationFileMatchers({
  testDir: "src",
  validationDir: "data/unit-test/validation",
  outputDir: "data/unit-test/output",
});
