import { defineConfig } from "tsup";

import { tsupConfig } from "./src/tsup";

export default defineConfig((options) =>
  tsupConfig({
    entry: ["src/tsup.ts", "src/vitest.ts", "src/eslint.ts"],
    ...options,
  }),
);
