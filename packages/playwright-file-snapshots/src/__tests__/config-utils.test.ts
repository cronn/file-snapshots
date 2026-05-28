import { test, expect } from "vitest";

import type { PlaywrightValidationFileMatcherConfig } from "../matchers/types";
import { defineConfig } from "../utils/config";

test("return original options as matcher config", () => {
  const options: PlaywrightValidationFileMatcherConfig = {
    validationDir: "/validation",
    outputDir: "/output",
    updateDelay: 1000,
  };

  expect(defineConfig(options)).toBe(options);
});
