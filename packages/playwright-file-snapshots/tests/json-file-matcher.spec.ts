import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

const expect = defineValidationFileExpect();

test("matches value with JSON file", () => {
  expect({ key: "value" }).toMatchJsonFile();
});

test("when includeUndefinedObjectProperties is true, serializes undefined object properties", () => {
  expect({ undefinedValue: undefined }).toMatchJsonFile({
    includeUndefinedObjectProperties: true,
  });
});

test("applies normalizer", () => {
  function maskNumber(value: unknown): unknown {
    if (typeof value !== "number") {
      return value;
    }

    return "[NUMBER]";
  }

  expect({ number: 4711 }).toMatchJsonFile({ normalizers: [maskNumber] });
});

test("uses namingStrategy file by default", () => {
  expect("value").toMatchJsonFile({ name: "name" });
});

test("applies naming strategy fileSuffix", () => {
  expect("value").toMatchJsonFile({
    name: "name",
    namingStrategy: "fileSuffix",
  });
});
