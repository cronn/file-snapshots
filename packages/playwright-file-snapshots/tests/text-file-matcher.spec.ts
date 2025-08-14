import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

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

test("uses namingStrategy file by default", async () => {
  await expect("value").toMatchTextFile({ name: "name" });
});

test("applies naming strategy fileSuffix", async () => {
  await expect("value").toMatchTextFile({
    name: "name",
    namingStrategy: "fileSuffix",
  });
});
