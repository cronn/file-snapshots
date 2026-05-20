import { test } from "@playwright/test";

import { maskString, stringNormalizer } from "@cronn/lib-file-snapshots";

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

test("matches value with JSON file", async () => {
  await expect({ key: "value" }).toMatchJsonFile();
});

test("matches async value with JSON file", async () => {
  await expect(Promise.resolve(["async value"])).toMatchJsonFile();
});

test("matches function value with JSON file", async () => {
  await expect(() => ["function value"]).toMatchJsonFile();
});

test("matches async function value with JSON file", async () => {
  await expect(() =>
    Promise.resolve(["async function value"]),
  ).toMatchJsonFile();
});

test("when includeUndefinedObjectProperties is true, serializes undefined object properties", async () => {
  await expect({ undefinedValue: undefined }).toMatchJsonFile({
    includeUndefinedObjectProperties: true,
  });
});

test("applies normalizer", async () => {
  await expect({ date: "2000-01-01" }).toMatchJsonFile({
    normalizers: [stringNormalizer(maskString("2000-01-01", "<TODAY>"))],
  });
});

test("applies name", async () => {
  await expect("value").toMatchJsonFile({ name: "name" });
});

test("applies custom file path resolver", async () => {
  await expect("value").toMatchJsonFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
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
    testExpect("initial value").toMatchJsonFile(),
  ).rejects.toThrowError();
  await expect(() =>
    testExpect(() => {
      instrumentation.addSnapshot();
      return "changed value";
    }).toMatchJsonFile(),
  ).rejects.toThrowError();

  assertSnapshotIntervals([100], instrumentation);
});
