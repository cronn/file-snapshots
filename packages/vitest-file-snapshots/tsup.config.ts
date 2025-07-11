import { defineConfig } from "tsup";

import { tsupConfig } from "@cronn/shared-configs/tsup";

export default defineConfig((options) =>
  tsupConfig({
    entry: ["src/register.ts"],
    ...options,
  }),
);
