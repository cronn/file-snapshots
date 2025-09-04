import type { Linter } from "eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export function eslintConfig(): Array<Linter.Config> {
  return defineConfig(
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    eslintConfigPrettier,
    {
      plugins: {
        "unused-imports": eslintPluginUnusedImports,
      },
      languageOptions: {
        sourceType: "module",
        parserOptions: {
          projectService: true,
        },
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    },
    {
      rules: {
        eqeqeq: ["error", "always"],
        "no-console": ["warn"],
        "no-debugger": ["warn"],
        "func-style": ["error", "declaration"],
        "no-duplicate-imports": ["error", { allowSeparateTypeImports: true }],
        "no-restricted-exports": [
          "error",
          { restrictedNamedExports: ["default"] },
        ],

        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/switch-exhaustiveness-check": [
          "error",
          {
            considerDefaultExhaustiveForUnions: true,
          },
        ],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/array-type": ["error", { default: "generic" }],
        "@typescript-eslint/no-empty-object-type": [
          "error",
          { allowInterfaces: "with-single-extends" },
        ],

        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
      },
    },
  );
}
