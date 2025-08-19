import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";
import { testFilePathResolver } from "../src/utils/test";

const expect = defineValidationFileExpect();

test("matches value with JSON file", async () => {
  await expect({ key: "value" }).toMatchJsonFile();
});

test("when includeUndefinedObjectProperties is true, serializes undefined object properties", async () => {
  await expect({ undefinedValue: undefined }).toMatchJsonFile({
    includeUndefinedObjectProperties: true,
  });
});

test("applies normalizer", async () => {
  function maskNumber(value: unknown): unknown {
    if (typeof value !== "number") {
      return value;
    }

    return "[NUMBER]";
  }

  await expect({ number: 4711 }).toMatchJsonFile({ normalizers: [maskNumber] });
});

test("applies name", async () => {
  await expect("value").toMatchJsonFile({ name: "name" });
});

test("applies custom file path resolver", async () => {
  await expect("value").toMatchJsonFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
  });
});
