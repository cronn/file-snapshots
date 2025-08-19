import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";
import { testFilePathResolver } from "../src/utils/test";

test("stores snapshots in custom directories", async () => {
  const expect = defineValidationFileExpect({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  await expect("value").toMatchTextFile();
});

test("applies custom file path resolver", async () => {
  const expect = defineValidationFileExpect({
    resolveFilePath: testFilePathResolver,
  });

  await expect("value").toMatchTextFile({ name: "name" });
});

test.fail("uses soft assertions by default", async () => {
  const expect = defineValidationFileExpect();

  await expect(() =>
    expect("changed value").toMatchJsonFile(),
  ).rejects.toThrowError();
});

test("disables soft assertions", async () => {
  const expect = defineValidationFileExpect({
    soft: false,
  });

  await expect(() =>
    expect("changed value").toMatchJsonFile(),
  ).rejects.toThrowError();
});

test("applies indentSize to JSON file snapshots", async () => {
  const expect = defineValidationFileExpect({
    indentSize: 4,
  });

  await expect({ key: "value" }).toMatchJsonFile();
});

test("ignores indentSize in text file snapshots", async () => {
  const expect = defineValidationFileExpect({
    indentSize: 4,
  });

  await expect("value").toMatchTextFile();
});
