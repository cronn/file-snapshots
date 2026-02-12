import { beforeEach, expect, test } from "vitest";

import { registerValidationFileMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

beforeEach(() => registerValidationFileMatchers());

test("matches value with JSON file", () => {
  expect({
    key: "value",
  }).toMatchJsonFile();
});

test("when matcher is inverted, throws error", () => {
  expect(() => expect("value").not.toMatchJsonFile()).toThrowError();
});

test("when includeUndefinedObjectProperties is true, serializes undefined object properties", () => {
  expect({
    undefinedValue: undefined,
  }).toMatchJsonFile({ includeUndefinedObjectProperties: true });
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

test("applies name", () => {
  expect.soft("value1").toMatchJsonFile({ name: "value 1" });
  expect.soft("value2").toMatchJsonFile({ name: "value 2" });
});

test("applies custom file path resolver", () => {
  expect("value").toMatchJsonFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
  });
});
