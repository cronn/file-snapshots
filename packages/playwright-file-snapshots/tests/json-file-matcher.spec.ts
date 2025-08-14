import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

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

test("uses namingStrategy file by default", async () => {
  await expect("value").toMatchJsonFile({ name: "name" });
});

test("applies naming strategy fileSuffix", async () => {
  await expect("value").toMatchJsonFile({
    name: "name",
    namingStrategy: "fileSuffix",
  });
});
