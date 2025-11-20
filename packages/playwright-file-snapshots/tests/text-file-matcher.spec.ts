import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";
import {
  SNAPSHOT_UPDATE_TAG,
  SnapshotInstrumentation,
  assertSnapshotIntervals,
  runOnlyWhenSnapshotUpdatesAreEnabled,
  testFilePathResolver,
} from "../src/utils/test";

const expect = defineValidationFileExpect();

test("matches value with text file", async () => {
  await expect("value").toMatchTextFile();
});

test("matches async value with text file", async () => {
  await expect(Promise.resolve("async value")).toMatchTextFile();
});

test("matches function value with text file", async () => {
  await expect(() => "function value").toMatchTextFile();
});

test("matches async function value with text file", async () => {
  await expect(() => Promise.resolve("async function value")).toMatchTextFile();
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

test("applies custom file extension", async () => {
  await expect("# Heading").toMatchTextFile({
    fileExtension: "md",
  });
});

test("applies update delay", { tag: [SNAPSHOT_UPDATE_TAG] }, async () => {
  runOnlyWhenSnapshotUpdatesAreEnabled();

  const testExpect = defineValidationFileExpect({
    updateDelay: 100,
  });

  const instrumentation = new SnapshotInstrumentation();
  await expect(() =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return "changed value";
    }).toMatchTextFile(),
  ).rejects.toThrowError();

  assertSnapshotIntervals([100], instrumentation);
});
