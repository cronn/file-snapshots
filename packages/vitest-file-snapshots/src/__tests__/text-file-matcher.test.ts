import { beforeEach, expect, test } from "vitest";

import { registerValidationFileMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

beforeEach(() => registerValidationFileMatchers());

test("matches value with text file", () => {
  expect("value").toMatchTextFile();
});

test("when matcher is inverted, throws error", () => {
  expect(() => expect("value").not.toMatchTextFile()).toThrowError();
});

test("applies normalizer", () => {
  function maskNumber(value: string): string {
    return value.replaceAll(/\d+/g, "[NUMBER]");
  }

  expect("4711").toMatchTextFile({ normalizers: [maskNumber] });
});

test("applies name", () => {
  expect.soft("value1").toMatchTextFile({ name: "value 1" });
  expect.soft("value2").toMatchTextFile({ name: "value 2" });
});

test("applies custom file path resolver", () => {
  expect("value").toMatchTextFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
  });
});

test("applies custom file extension", () => {
  expect("# Heading").toMatchTextFile({
    fileExtension: "md",
  });
});
