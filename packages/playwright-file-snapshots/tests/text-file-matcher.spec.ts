import { test } from "@playwright/test";

import { maskString } from "@cronn/lib-file-snapshots";

import { defineFileSnapshotMatchers } from "../src";
import {
  SnapshotInstrumentation,
  assertSnapshotIntervals,
  runOnlyWhenSnapshotUpdatesAreEnabled,
  tags,
  temporarySnapshotDirs,
  testFilePathResolver,
} from "../src/utils/test";

const expect = defineFileSnapshotMatchers();

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
  await expect("2000-01-01").toMatchTextFile({
    normalizers: [maskString("2000-01-01", "<TODAY>")],
  });
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

test("applies update delay", { tag: tags.updateAll }, async () => {
  runOnlyWhenSnapshotUpdatesAreEnabled();

  const testExpect = defineFileSnapshotMatchers({
    ...temporarySnapshotDirs(),
    updateDelay: 100,
  });

  const instrumentation = new SnapshotInstrumentation();
  await expect(() =>
    testExpect("initial value").toMatchTextFile(),
  ).rejects.toThrowError();
  await expect(() =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return "changed value";
    }).toMatchTextFile(),
  ).rejects.toThrowError();

  assertSnapshotIntervals([100], instrumentation);
});
