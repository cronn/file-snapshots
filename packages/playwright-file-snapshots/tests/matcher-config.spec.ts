import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../src";

test("stores snapshots in custom directories", () => {
  const expect = defineValidationFileExpect({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  expect("value").toMatchTextFile();
});

test("filters steps from snapshot file path", () => {
  const expect = defineValidationFileExpect({
    filterSteps: (stepTitle): boolean => stepTitle !== "Excluded step",
  });

  test.step("Included step", () => {
    test.step("Excluded step", () => {
      expect("value").toMatchTextFile();
    });
  });
});

test.fail("uses soft assertions by default", () => {
  const expect = defineValidationFileExpect();

  expect(() =>
    expect("changed value").toMatchJsonFile(),
  ).rejects.toThrowError();
});

test("disables soft assertions", () => {
  const expect = defineValidationFileExpect({
    soft: false,
  });

  expect(() =>
    expect("changed value").toMatchJsonFile(),
  ).rejects.toThrowError();
});

test("applies indentSize to JSON file snapshots", () => {
  const expect = defineValidationFileExpect({
    indentSize: 4,
  });

  expect({ key: "value" }).toMatchJsonFile();
});

test("ignores indentSize in text file snapshots", async () => {
  const expect = defineValidationFileExpect({
    indentSize: 4,
  });

  await expect("value").toMatchTextFile();
});
