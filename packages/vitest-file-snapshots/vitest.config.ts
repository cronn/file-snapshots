import { defineConfig } from "vitest/config";

import { vitestConfig } from "@cronn/shared-configs/vitest";

import { tags } from "./src/utils/test";

export default defineConfig(
  vitestConfig({
    tags: [
      {
        name: tags.updateAll,
        description: "Tests depending on --update all",
      },
      {
        name: tags.updateNew,
        description: "Tests depending on --update new",
      },
      {
        name: tags.updateNone,
        description: "Tests depending on --update none",
      },
    ],
  }),
);
