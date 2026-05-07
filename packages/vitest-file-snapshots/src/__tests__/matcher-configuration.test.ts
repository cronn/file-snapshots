import { expect, test } from "vitest";

import { registerFileSnapshotMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

test("resolves test path relative to testDir", () => {
  registerFileSnapshotMatchers({
    testDir: "src",
  });

  expect("value").toMatchTextFile();
});

test("stores snapshots in custom directories", () => {
  registerFileSnapshotMatchers({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  expect("value").toMatchTextFile();
});

test("applies indentSize to JSON file snapshots", () => {
  registerFileSnapshotMatchers({
    indentSize: 4,
  });

  expect({ key: "value" }).toMatchJsonFile();
});

test("ignores indentSize in text file snapshots", () => {
  registerFileSnapshotMatchers({
    indentSize: 4,
  });

  expect("value").toMatchTextFile();
});

test("applies custom file path resolver", () => {
  registerFileSnapshotMatchers({
    resolveFilePath: testFilePathResolver,
  });

  expect("value").toMatchTextFile({ name: "name" });
});
