import type { FullConfig } from "@playwright/test";
import path from "node:path";
import { describe, expect, test } from "vitest";

import type { ParsedTestInfo } from "./utils";
import {
  parseTestInfo,
  parseTestPath,
  parseTestStepInfo,
  parseTitlePath,
  parseUpdateSnapshots,
} from "./utils";

function createConfig(values: Partial<FullConfig> = {}): FullConfig {
  return {
    projects: [],
    reporter: [],
    webServer: null,
    forbidOnly: false,
    fullyParallel: false,
    globalSetup: null,
    globalTeardown: null,
    globalTimeout: 0,
    grep: [],
    grepInvert: null,
    maxFailures: 0,
    metadata: {},
    preserveOutput: "never",
    quiet: false,
    reportSlowTests: null,
    rootDir: "",
    shard: null,
    updateSnapshots: "none",
    updateSourceMethod: "overwrite",
    version: "",
    workers: 0,
    ...values,
  };
}

describe("parseTestInfo", () => {
  test("returns parsed test info", async () => {
    function normalizeRootDir(testInfo: ParsedTestInfo): ParsedTestInfo {
      return {
        ...testInfo,
        rootDir: path.basename(testInfo.rootDir),
      };
    }

    await expect(
      parseTestInfo({
        config: createConfig({
          rootDir: import.meta.url,
          updateSnapshots: "changed",
        }),
      }).then(normalizeRootDir),
    ).resolves.toStrictEqual({
      rootDir: "playwright-file-snapshots",
      updateSnapshots: true,
    });
  });
});

describe("parseUpdateSnapshots", () => {
  test("when value is 'changed', returns true", () => {
    expect(parseUpdateSnapshots("changed")).toBe(true);
  });

  test.each(["none", "missing", "all"] as const)(
    "when value is '%s', returns false",
    (value) => {
      expect(parseUpdateSnapshots(value)).toBe(false);
    },
  );
});

describe("parseTestStepInfo", () => {
  test("returns parsed test step info", () => {
    expect(
      parseTestStepInfo({
        titlePath: [
          "path/to/test.spec.ts",
          "test title",
          'Expect "soft toMatchJsonFile"',
          "Match validation file",
        ],
      }),
    ).toStrictEqual({ testPath: "path/to/test", titlePath: ["test title"] });
  });

  test("when titlePath is empty, throws errors", () => {
    expect(() => parseTestStepInfo({ titlePath: [] })).toThrowError();
  });
});

describe("parseTestPath", () => {
  test.each([
    ".spec.ts",
    ".test.ts",
    ".spec.js",
    ".test.js",
    ".spec.mjs",
    ".test.mjs",
  ])("removes test extension %s from test path", (testExtension) => {
    expect(parseTestPath(`tests/feature${testExtension}`)).toBe(
      "tests/feature",
    );
  });
});

describe("parseTitlePath", () => {
  test("returns user-defined titles", () => {
    expect(
      parseTitlePath([
        "test title",
        "step title",
        'Expect "toThrowError"',
        'Expect "soft toMatchJsonFile"',
        "Match validation file",
      ]),
    ).toStrictEqual(["test title", "step title"]);
  });

  test("when titlePath has length 2, returns empty array", () => {
    expect(
      parseTitlePath([
        'Expect "soft toMatchJsonFile"',
        "Match validation file",
      ]),
    ).toHaveLength(0);
  });

  test("when titlePath has length 1, returns empty array", () => {
    expect(
      parseTitlePath([
        'Expect "soft toMatchJsonFile"',
        "Match validation file",
      ]),
    ).toHaveLength(0);
  });

  test("when titlePath is empty, returns empty array", () => {
    expect(parseTitlePath([])).toHaveLength(0);
  });
});
