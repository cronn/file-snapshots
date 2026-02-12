import { expect, test } from "vitest";

import { registerValidationFileMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

test("resolves test path relative to testDir", () => {
  registerValidationFileMatchers({
    testDir: "src",
  });

  expect("value").toMatchTextFile();
});

test("stores snapshots in custom directories", () => {
  registerValidationFileMatchers({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  expect("value").toMatchTextFile();
});

test("applies indentSize to JSON file snapshots", () => {
  registerValidationFileMatchers({
    indentSize: 4,
  });

  expect({ key: "value" }).toMatchJsonFile();
});

test("ignores indentSize in text file snapshots", () => {
  registerValidationFileMatchers({
    indentSize: 4,
  });

  expect("value").toMatchTextFile();
});

test("applies custom file path resolver", () => {
  registerValidationFileMatchers({
    resolveFilePath: testFilePathResolver,
  });

  expect("value").toMatchTextFile({ name: "name" });
});
