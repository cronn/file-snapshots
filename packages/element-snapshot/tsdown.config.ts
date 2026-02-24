import { defineConfig } from "tsdown";

import { tsdownConfig } from "@cronn/shared-configs/tsdown";

export default defineConfig((options) => [
  tsdownConfig({
    entry: ["src/index.ts"],
    format: {
      esm: {
        entry: {
          index: "src/index.ts",
        },
      },
      iife: {
        entry: {
          "browser-lib": "src/browser-lib.ts",
        },
      },
    },
    ...options,
  }),
]);
