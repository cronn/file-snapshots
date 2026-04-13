import type { PackageJSON, Repository } from "@npm/types";
import type { FormatPluginFnOptions } from "@pnpm/meta-updater";
import fs from "node:fs";
import path from "node:path";

const tsSourceDirs: Array<string> = ["src/", "tests/"];

export function updatePackageJson(
  manifest: PackageJSON,
  options: FormatPluginFnOptions,
): PackageJSON {
  const { dir } = options;
  const context = resolvePackageContext(manifest, dir);

  return {
    ...manifest,
    bugs: when(context.isPublic, {
      url: "https://github.com/cronn/file-snapshots/issues",
    }),
    author: "cronn",
    license: "Apache-2.0",
    repository: defineRepository(context),
    homepage: manifest.homepage ?? "https://github.com/cronn/file-snapshots",
    engines: {
      node: "^20 || ^22 || >=24",
    },
    devEngines: {
      runtime: {
        name: "node",
        version: ">=24.14.1 <25",
        onFail: "error",
      },
      packageManager: {
        name: "pnpm",
        version: ">=10.33.0 <11",
        onFail: "error",
      },
    },
    scripts: updateScripts(manifest.scripts, context),
    type: "module",
    devDependencies: updateDevDependencies(manifest.devDependencies, context),
  };
}

function findWorkspaceRootDir(startDir: string): string {
  let currentDir = startDir;

  while (true) {
    const workspaceFile = path.resolve(currentDir, "pnpm-workspace.yaml");

    if (fs.existsSync(workspaceFile)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    // Reached filesystem root without finding workspace file
    if (parentDir === currentDir) {
      throw new Error("Could not find workspace root directory.");
    }

    currentDir = parentDir;
  }
}

interface PackageContext {
  absoluteDir: string;
  relativeDir: string;
  isRoot: boolean;
  isPublic: boolean;
  needsEslint: boolean;
  needsTsdown: boolean;
  needsTypeScript: boolean;
  needsPlaywright: boolean;
  needsVitest: boolean;
}

function resolvePackageContext(
  manifest: PackageJSON,
  absoluteDir: string,
): PackageContext {
  const workspaceRootDir = findWorkspaceRootDir(absoluteDir);
  const relativeDir = path
    .relative(workspaceRootDir, absoluteDir)
    .replace(/\\/g, "/");

  return {
    absoluteDir,
    relativeDir,
    isRoot: relativeDir === "",
    isPublic: manifest.private !== true,
    needsEslint: fs.existsSync(path.resolve(absoluteDir, "eslint.config.ts")),
    needsTsdown: fs.existsSync(path.resolve(absoluteDir, "tsdown.config.ts")),
    needsTypeScript: fs.existsSync(path.resolve(absoluteDir, "tsconfig.json")),
    needsPlaywright: fs.existsSync(
      path.resolve(absoluteDir, "playwright.config.ts"),
    ),
    needsVitest: fs.existsSync(path.resolve(absoluteDir, "vitest.config.ts")),
  };
}

function defineRepository(context: PackageContext): Repository {
  return {
    type: "git",
    url: "git+https://github.com/cronn/file-snapshots.git",
    directory: context.isRoot ? undefined : context.relativeDir,
  };
}

type Scripts = PackageJSON["scripts"];

function updateScripts(scripts: Scripts, context: PackageContext): Scripts {
  return {
    ...scripts,
    ...when(
      context.needsEslint,
      updateLintScripts(scripts, context.relativeDir),
    ),
    ...when(context.needsTypeScript, defineCompileScript()),
    ...when(context.needsTsdown, updateBuildScript(scripts)),
    ...updateCleanScript(scripts, context),
  };
}

function updateLintScripts(
  scripts: Scripts,
  packageDir: string,
): Scripts | undefined {
  const lintedDirs = tsSourceDirs
    .filter((lintedDir) => fs.existsSync(path.resolve(packageDir, lintedDir)))
    .join(" ");

  return {
    ...updateScript(
      "lint:check",
      `eslint ${lintedDirs} --max-warnings=0`,
      scripts,
    ),
    ...updateScript(
      "lint:fix",
      `eslint ${lintedDirs} --max-warnings=0 --fix`,
      scripts,
    ),
  };
}

function defineCompileScript(): Scripts | undefined {
  return {
    compile: "tsgo",
  };
}

function updateBuildScript(scripts: Scripts): Scripts | undefined {
  return updateScript("build", "tsdown", scripts);
}

function updateCleanScript(
  scripts: Scripts,
  context: PackageContext,
): Scripts | undefined {
  const outputDirs = [".turbo"];

  if (context.needsTsdown) {
    outputDirs.push("dist");
  }

  if (context.needsPlaywright) {
    outputDirs.push("playwright-report", "test-results");
  }

  if (context.needsVitest) {
    outputDirs.push("coverage");
  }

  const collectedOutputDirs = outputDirs.join(" ");

  return updateScript("clean", `rimraf ${collectedOutputDirs}`, scripts);
}

function updateScript(
  name: string,
  defaultValue: string,
  scripts: Scripts,
): Scripts {
  return { [name]: scripts?.[name] ?? defaultValue };
}

type DevDependencies = PackageJSON["devDependencies"];

function updateDevDependencies(
  devDependencies: DevDependencies,
  context: PackageContext,
): DevDependencies {
  return {
    ...devDependencies,
    ...when(context.needsTsdown, { "@arethetypeswrong/core": "catalog:" }),
    ...when(context.needsEslint, {
      "@trivago/prettier-plugin-sort-imports": "catalog:",
    }),
    ...when(context.needsTypeScript, {
      "@typescript/native-preview": "catalog:",
    }),
    ...when(context.needsEslint, {
      eslint: "catalog:",
      "eslint-config-prettier": "catalog:",
      "eslint-plugin-check-file": "catalog:",
      "eslint-plugin-unused-imports": "catalog:",
    }),
    prettier: "catalog:",
    rimraf: "catalog:",
    ...when(context.needsTsdown, { publint: "catalog:", tsdown: "catalog:" }),
    ...when(context.needsEslint, { "typescript-eslint": "catalog:" }),
  };
}

function when<TValue>(condition: boolean, value: TValue): TValue | undefined {
  return condition ? value : undefined;
}
