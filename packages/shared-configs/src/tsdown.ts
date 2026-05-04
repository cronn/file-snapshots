import type { UserConfig } from "tsdown";

interface TsdownContext {
  ci: boolean;
}

export function tsdownConfig(
  options: UserConfig,
  context: TsdownContext,
): UserConfig {
  return {
    platform: "node",
    format: ["esm"],
    dts: {
      sourcemap: !context.ci,
    },
    outDir: "./dist",
    clean: true,
    deps: {
      skipNodeModulesBundle: true,
    },
    publint: true,
    attw: {
      profile: "esm-only",
    },
    ...options,
  };
}
