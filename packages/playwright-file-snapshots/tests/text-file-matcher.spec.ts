import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

const expect = defineValidationFileExpect();

test("matches value with text file", () => {
  expect("value").toMatchTextFile();
});

test("when name is specified, appends suffix to snapshot file name", () => {
  expect("value").toMatchTextFile({ name: "name" });
});

test("applies normalizer", () => {
  function maskNumber(value: string): string {
    return value.replaceAll(/\d+/g, "[NUMBER]");
  }

  expect("4711").toMatchTextFile({ normalizers: [maskNumber] });
});
