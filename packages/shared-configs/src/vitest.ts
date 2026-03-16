import {
  type TestUserConfig,
  type ViteUserConfig,
  configDefaults,
} from "vitest/config";

export function vitestConfig(config: TestUserConfig = {}): ViteUserConfig {
  return {
    test: {
      include: ["src/__tests__/**/*.test.ts"],
      exclude: configDefaults.exclude,
      environment: "node",
      reporters: ["default"],
      globals: true,
      coverage: {
        provider: "v8",
        reporter: ["text-summary", "html"],
        include: ["src/**/*.{js,jsx,ts,tsx}"],
      },
      ...config,
    },
  };
}
