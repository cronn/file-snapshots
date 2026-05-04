import { defineConfig } from "tsdown";

import { tsdownConfig } from "@cronn/shared-configs/tsdown";

export default defineConfig((options, context) =>
  tsdownConfig(
    {
      entry: ["src/index.ts"],
      ...options,
    },
    context,
  ),
);
