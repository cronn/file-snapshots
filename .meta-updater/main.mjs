import { createUpdateOptions } from "@pnpm/meta-updater";

export default function () {
  return createUpdateOptions({
    files: {
      "package.json": (manifest) => {
        return {
          ...manifest,
          packageManager: "pnpm@10.24.0",
          engines: {
            node: "^20 || ^22 || >=24",
          },
          devEngines: {
            runtime: {
              name: "node",
              version: ">=24.11 <25",
              onFail: "error",
            },
            packageManager: {
              name: "pnpm",
              version: ">=10.21 <11",
              onFail: "error",
            },
          },
        };
      },
    },
  });
}
