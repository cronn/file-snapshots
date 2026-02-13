import type { UserConfig } from "tsdown";

export function tsdownConfig(options: UserConfig): UserConfig {
  return {
    platform: "node",
    format: ["esm"],
    dts: true,
    outDir: "./dist",
    clean: true,
    skipNodeModulesBundle: true,
    ...options,
  };
}
