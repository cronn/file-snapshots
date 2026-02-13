import { defineConfig } from "tsdown";

import { tsdownConfig } from "@cronn/shared-configs/tsdown";

export default defineConfig((options) =>
  tsdownConfig({
    entry: ["src/index.ts", "src/register.ts"],
    ...options,
  }),
);
