import { describe, expect, test } from "vitest";
import {
  type RawTestInfo,
  parseTestInfo,
  parseTestPath,
  parseTestSteps,
} from "./utils";

describe("parseTestInfo", () => {
  test("when titlePath is empty, throws error", () => {
    expect(() => parseTestInfo({ titlePath: [] })).toThrowError();
  });

  test("when _steps is missing, throws error", () => {
    expect(() =>
      parseTestInfo({ titlePath: ["tests/feature.spec.ts", "test title"] }),
    ).toThrowError();
  });

  test("filters steps using custom filter", () => {
    expect(
      parseTestInfo(
        {
          titlePath: ["tests/feature.spec.ts", "test title"],
          _steps: [
            {
              title: "included step 1",
              category: "test.step",
              steps: [
                {
                  title: "excluded step",
                  category: "test.step",
                  steps: [
                    {
                      title: "included step 2",
                      category: "test.step",
                      steps: [],
                    },
                  ],
                },
              ],
            },
          ],
        } as RawTestInfo,
        (stepTitle): boolean => stepTitle !== "excluded step",
      ),
    ).toStrictEqual({
      testPath: "tests/feature",
      titlePath: ["test title", "included step 1", "included step 2"],
    });
  });
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
