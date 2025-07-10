import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

const expect = defineValidationFileExpect();

test("matches value with text file", () => {
  expect("value").toMatchTextFile();
});

test("applies normalizer", () => {
  function maskNumber(value: string): string {
    return value.replaceAll(/\d+/g, "[NUMBER]");
  }

  expect("4711").toMatchTextFile({ normalizers: [maskNumber] });
});

test("uses namingStrategy file by default", () => {
  expect("value").toMatchTextFile({ name: "name" });
});

test("applies naming strategy fileSuffix", () => {
  expect("value").toMatchTextFile({
    name: "name",
    namingStrategy: "fileSuffix",
  });
});
