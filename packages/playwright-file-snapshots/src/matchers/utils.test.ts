import type { FullConfig } from "@playwright/test";
import { describe, expect, test } from "vitest";

import {
  type RawTestInfo,
  parseTestInfo,
  parseTestPath,
  parseTestSteps,
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
  test("when titlePath is empty, throws error", () => {
    expect(() =>
      parseTestInfo({
        titlePath: [],
        config: createConfig(),
      }),
    ).toThrowError();
  });

  test("when _steps is missing, throws error", () => {
    expect(() =>
      parseTestInfo({
        titlePath: ["tests/feature.spec.ts", "test title"],
        config: createConfig(),
      }),
    ).toThrowError();
  });

  test("when config.updateSnapshots is 'missing', resolves updateSnapshots to true", () => {
    expect(
      parseTestInfo({
        titlePath: ["tests/feature.spec.ts"],
        _steps: [],
        config: createConfig({ updateSnapshots: "changed" }),
      } as RawTestInfo),
    ).toStrictEqual({
      testPath: "tests/feature",
      titlePath: [],
      updateSnapshots: true,
    });
  });

  test.each(["none", "missing", "all"] as const)(
    "when config.updateSnapshots is '%s', resolves updateSnapshots to false",
    (value) => {
      expect(
        parseTestInfo({
          titlePath: ["tests/feature.spec.ts"],
          _steps: [],
          config: createConfig({ updateSnapshots: value }),
        } as RawTestInfo),
      ).toStrictEqual({
        testPath: "tests/feature",
        titlePath: [],
        updateSnapshots: false,
      });
    },
  );
});

describe("parseTestSteps", () => {
  test("extracts titles of user defined test steps", () => {
    expect(
      parseTestSteps([
        { title: "expect", category: "expect", steps: [] },
        { title: "pw:api", category: "pw:api", steps: [] },
        { title: "hook", category: "hook", steps: [] },
        { title: "fixture", category: "fixture", steps: [] },
        { title: "attach", category: "test.attach", steps: [] },
        {
          title: "root step",
          category: "test.step",
          steps: [
            {
              title: "nested step",
              category: "test.step",
              steps: [],
            },
          ],
        },
      ]),
    ).toStrictEqual(["root step", "nested step"]);
  });

  test("when steps contain no user defined step, returns empty array", () => {
    expect(
      parseTestSteps([
        { title: "expect", category: "expect", steps: [] },
        { title: "pw:api", category: "pw:api", steps: [] },
        { title: "hook", category: "hook", steps: [] },
        { title: "fixture", category: "fixture", steps: [] },
        { title: "attach", category: "test.attach", steps: [] },
        {
          title: "expect",
          category: "test.step",
          apiName: "expect.toPass",
          steps: [],
        },
        {
          title: "expect",
          category: "test.step",
          apiName: "expect.not.toPass",
          steps: [],
        },
      ]),
    ).toHaveLength(0);
  });

  test("when last step is no user defined step, returns empty array", () => {
    expect(
      parseTestSteps([
        {
          title: "step",
          category: "test.step",
          steps: [],
        },
        { title: "expect", category: "expect", steps: [] },
      ]),
    ).toHaveLength(0);
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
