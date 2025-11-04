import { defineConfig } from "tsup";

import { tsupConfig } from "@cronn/shared-configs/tsup";

export default defineConfig((options) => [
  tsupConfig({
    entry: ["src/index.ts"],
    format: ["iife"],
    ...options,
  }),
  tsupConfig({
    entry: ["src/types.ts"],
    ...options,
  }),
]);
