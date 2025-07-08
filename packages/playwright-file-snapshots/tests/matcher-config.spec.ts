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
