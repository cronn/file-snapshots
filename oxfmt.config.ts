import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    ".idea",
    // tests
    "**/data/test/",
    "**/data/unit-test/",
    "**/data/integration-test/",
    "**/custom-data/test/",
    "__snapshots__",
    // VitePress
    "packages/docs/.vitepress/cache",
    "packages/docs/.vitepress/dist",
  ],
  sortImports: {
    customGroups: [
      { groupName: "workspace-import", elementNamePattern: ["@cronn/**"] },
    ],
    groups: [
      ["type-import", "value-builtin", "value-external"],
      "workspace-import",
      ["type-internal", "value-internal"],
      ["type-parent", "value-parent"],
      ["type-sibling", "value-sibling", "type-index", "value-index"],
      "unknown",
    ],
  },
});
