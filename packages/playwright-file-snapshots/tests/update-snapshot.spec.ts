import { type Expect, expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { defineValidationFileExpect } from "../src";
import type { PlaywrightValidationFileMatchers } from "../src/matchers/types";
import { resolvePackageRootDir } from "../src/utils/file";
import {
  type PlaywrightUpdateType,
  runOnlyWhenSnapshotUpdatesAreEnabled,
  runOnlyWhenUpdateSnapshotsIs,
  tags,
  temporarySnapshotDirs,
} from "../src/utils/test";

const initialValidationFile = ["===== missing file =====", "initial value", ""];
const changedValidationFile = ["changed value", ""];

test("when updateSnapshots is 'missing', creates missing validation file", async () => {
  runOnlyWhenUpdateSnapshotsIs("missing");

  const snapshotDirs = temporarySnapshotDirs();
  const testExpect = defineValidationFileExpect(snapshotDirs);

  await matchInitialValueWithError(testExpect);

  expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
    initialValidationFile,
  );
});

test("when updateSnapshots is 'missing', does not update changed validation file", async () => {
  runOnlyWhenUpdateSnapshotsIs("missing");

  const snapshotDirs = temporarySnapshotDirs();
  const testExpect = defineValidationFileExpect(snapshotDirs);

  await matchInitialValueWithError(testExpect);
  await matchChangedValueWithError(testExpect);

  expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
    initialValidationFile,
  );
});

interface UpdateTestArgs {
  updateType: PlaywrightUpdateType;
  tag: string;
}

const updateTestCases: Array<UpdateTestArgs> = [
  { updateType: "all", tag: tags.updateAll },
  { updateType: "changed", tag: tags.updateChanged },
];

for (const { updateType, tag } of updateTestCases) {
  test(
    `when updateSnapshots is '${updateType}', creates missing validation file`,
    { tag },
    async () => {
      runOnlyWhenUpdateSnapshotsIs(updateType);

      const snapshotDirs = temporarySnapshotDirs();
      const testExpect = defineValidationFileExpect(snapshotDirs);

      await matchInitialValueWithError(testExpect);

      expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
        initialValidationFile,
      );
    },
  );

  test(
    `when updateSnapshots is '${updateType}', updates changed validation file`,
    { tag },
    async () => {
      runOnlyWhenSnapshotUpdatesAreEnabled();

      const snapshotDirs = temporarySnapshotDirs();
      const testExpect = defineValidationFileExpect(snapshotDirs);

      await matchInitialValueWithError(testExpect);
      await matchChangedValueWithError(testExpect);

      expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
        changedValidationFile,
      );
    },
  );
}

test(
  "when updateSnapshots is 'none', does not create missing validation file",
  { tag: tags.updateNone },
  async () => {
    runOnlyWhenUpdateSnapshotsIs("none");

    const testExpect = defineValidationFileExpect();

    await matchInitialValueWithError(testExpect);

    const validationDir = await getDefaultValidationDir();
    expect(() => readSnapshotFile(validationDir)).toThrowError();
  },
);

test(
  "when updateSnapshots is 'none', does not update changed validation file",
  { tag: tags.updateNone },
  async () => {
    runOnlyWhenUpdateSnapshotsIs("none");

    const testExpect = defineValidationFileExpect();

    await matchChangedValueWithError(testExpect);

    const validationDir = await getDefaultValidationDir();
    expect(readSnapshotFile(validationDir)).toStrictEqual(
      initialValidationFile,
    );
  },
);

function readSnapshotFile(validationDir: string): Array<string> {
  const normalizedTestTitle = test.info().title.replaceAll(/[ ,\']+/g, "_");

  return fs
    .readFileSync(
      path.resolve(
        validationDir,
        "update-snapshot",
        `${normalizedTestTitle}.txt`,
      ),
      {
        encoding: "utf8",
      },
    )
    .split("\n");
}

async function getDefaultValidationDir(): Promise<string> {
  const packageRootDir = await resolvePackageRootDir(import.meta.dirname);
  return path.join(packageRootDir, "/data/test/validation");
}

async function matchInitialValueWithError(
  testExpect: Expect<PlaywrightValidationFileMatchers>,
): Promise<void> {
  await expect(() =>
    testExpect("initial value").toMatchTextFile(),
  ).rejects.toThrowError();
}

async function matchChangedValueWithError(
  testExpect: Expect<PlaywrightValidationFileMatchers>,
): Promise<void> {
  await expect(() =>
    testExpect("changed value").toMatchTextFile(),
  ).rejects.toThrowError();
}
