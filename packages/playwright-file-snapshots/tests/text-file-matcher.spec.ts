import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";
import { testFilePathResolver } from "../src/utils/test";

const expect = defineValidationFileExpect();

test("matches value with text file", async () => {
  await expect("value").toMatchTextFile();
});

test("applies normalizer", async () => {
  function maskNumber(value: string): string {
    return value.replaceAll(/\d+/g, "[NUMBER]");
  }

  await expect("4711").toMatchTextFile({ normalizers: [maskNumber] });
});

test("applies name", async () => {
  await expect("value").toMatchTextFile({ name: "name" });
});

test("applies custom file path resolver", async () => {
  await expect("value").toMatchTextFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
  });
});
