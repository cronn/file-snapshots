import { type ViteUserConfig, configDefaults } from "vitest/config";

export function vitestConfig(): ViteUserConfig {
  return {
    test: {
      include: ["src/**/*.test.ts"],
      exclude: configDefaults.exclude,
      environment: "node",
      reporters: ["default"],
      globals: true,
      coverage: {
        provider: "v8",
        reporter: ["text-summary", "html"],
        include: ["src/**/*.{js,jsx,ts,tsx}"],
      },
    },
  };
}
