import { beforeEach, expect, test } from "vitest";

import { maskString, stringNormalizer } from "@cronn/lib-file-snapshots";

import { registerFileSnapshotMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

beforeEach(() => registerFileSnapshotMatchers());

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
  expect({ date: "2000-01-01" }).toMatchJsonFile({
    normalizers: [stringNormalizer(maskString("2000-01-01", "<TODAY>"))],
  });
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
