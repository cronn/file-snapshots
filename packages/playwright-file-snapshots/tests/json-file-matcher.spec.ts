import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

const expect = defineValidationFileExpect();

test("matches value with JSON file", () => {
  expect({ key: "value" }).toMatchJsonFile();
});

test("when name is specified, appends suffix to snapshot file name", () => {
  expect("value").toMatchJsonFile({ name: "name" });
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
