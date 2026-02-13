import { defineConfig } from "tsdown";

import { tsdownConfig } from "@cronn/shared-configs/tsdown";

export default defineConfig((options) => [
  tsdownConfig({
    entry: ["src/browser-lib.ts"],
    format: ["iife"],
    ...options,
  }),
  tsdownConfig({
    entry: ["src/index.ts"],
    ...options,
  }),
]);
