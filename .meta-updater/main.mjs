import { createUpdateOptions } from "@pnpm/meta-updater";

export default function () {
  return createUpdateOptions({
    files: {
      "package.json": (manifest) => {
        return {
          ...manifest,
          packageManager: "pnpm@10.28.2",
          engines: {
            node: "^20 || ^22 || >=24",
          },
          devEngines: {
            runtime: {
              name: "node",
              version: ">=24.13 <25",
              onFail: "error",
            },
            packageManager: {
              name: "pnpm",
              version: ">=10.28.2 <11",
              onFail: "error",
            },
          },
        };
      },
    },
  });
}
