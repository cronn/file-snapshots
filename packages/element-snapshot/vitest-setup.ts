import { registerFileSnapshotMatchers } from "@cronn/vitest-file-snapshots/register";

registerFileSnapshotMatchers({
  testDir: "src",
  validationDir: "data/unit-test/validation",
  outputDir: "data/unit-test/output",
});
