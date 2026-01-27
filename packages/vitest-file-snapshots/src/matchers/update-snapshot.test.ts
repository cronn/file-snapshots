import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";

import { registerValidationFileMatchers } from "../register";
import {
  isUpdateSnapshot,
  resolvePackageRootDir,
  temporarySnapshotDirs,
} from "../utils/test";

const initialValidationFile = ["===== missing file =====", "initial value", ""];
const changedValidationFile = ["changed value", ""];

test.runIf(isUpdateSnapshot("new"))(
  "when updateSnapshots is 'new', creates missing validation file",
  () => {
    const snapshotDirs = temporarySnapshotDirs();
    registerValidationFileMatchers(snapshotDirs);

    matchInitialValueWithError();

    expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
      initialValidationFile,
    );
  },
);

test.runIf(isUpdateSnapshot("new"))(
  "when updateSnapshots is 'new', does not update changed validation file",
  () => {
    const snapshotDirs = temporarySnapshotDirs();
    registerValidationFileMatchers(snapshotDirs);

    matchInitialValueWithError();
    matchChangedValueWithError();

    expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
      initialValidationFile,
    );
  },
);

test.runIf(isUpdateSnapshot("all"))(
  "when updateSnapshots is 'all', creates missing validation file",
  () => {
    const snapshotDirs = temporarySnapshotDirs();
    registerValidationFileMatchers(snapshotDirs);

    matchInitialValueWithError();

    expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
      initialValidationFile,
    );
  },
);

test.runIf(isUpdateSnapshot("all"))(
  "when updateSnapshots is 'all', updates changed validation file",
  () => {
    const snapshotDirs = temporarySnapshotDirs();
    registerValidationFileMatchers(snapshotDirs);

    matchInitialValueWithError();
    matchChangedValueWithError();

    expect(readSnapshotFile(snapshotDirs.validationDir)).toStrictEqual(
      changedValidationFile,
    );
  },
);

test.runIf(isUpdateSnapshot("none"))(
  "when updateSnapshots is 'none', does not create missing validation file",
  () => {
    const snapshotDirs = temporarySnapshotDirs();
    registerValidationFileMatchers(snapshotDirs);

    matchInitialValueWithError();

    expect(() => readSnapshotFile(snapshotDirs.validationDir)).toThrowError();
  },
);

test.runIf(isUpdateSnapshot("none"))(
  "when updateSnapshots is 'none', does not update changed validation file",
  async () => {
    registerValidationFileMatchers();

    matchChangedValueWithError();

    const validationDir = await getDefaultValidationDir();
    expect(readSnapshotFile(validationDir)).toStrictEqual(
      initialValidationFile,
    );
  },
);

function readSnapshotFile(validationDir: string): Array<string> {
  const normalizedTestTitle = expect
    .getState()
    .currentTestName?.replaceAll(/[ ,\']+/g, "_");

  return fs
    .readFileSync(
      path.resolve(
        validationDir,
        "src",
        "matchers",
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

function matchInitialValueWithError(): void {
  expect(() => expect("initial value").toMatchTextFile()).toThrowError();
}

function matchChangedValueWithError(): void {
  expect(() => expect("changed value").toMatchTextFile()).toThrowError();
}
