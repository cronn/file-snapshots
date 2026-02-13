import { defineConfig } from "tsdown";

import { tsdownConfig } from "./src/tsdown";

export default defineConfig((options) =>
  tsdownConfig({
    entry: [
      "src/tsdown.ts",
      "src/vitest.ts",
      "src/eslint.ts",
      "src/playwright.ts",
    ],
    ...options,
  }),
);
