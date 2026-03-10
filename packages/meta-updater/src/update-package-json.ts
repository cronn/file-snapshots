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
    homepage: "https://github.com/cronn/file-snapshots",
    packageManager: "pnpm@10.29.3",
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
    ...when(context.needsEslint, defineLintScripts(context.relativeDir)),
    ...when(context.needsTypeScript, defineCompileScript()),
    ...when(context.needsTsdown, updateBuildScript(scripts)),
  };
}

function defineLintScripts(packageDir: string): Scripts | undefined {
  const lintedDirs = tsSourceDirs
    .filter((lintedDir) => fs.existsSync(path.resolve(packageDir, lintedDir)))
    .join(" ");

  return {
    "lint:check": `eslint ${lintedDirs} --max-warnings=0`,
    "lint:fix": `eslint ${lintedDirs} --max-warnings=0 --fix`,
  };
}

function defineCompileScript(): Scripts | undefined {
  return {
    compile: "tsgo",
  };
}

function updateBuildScript(scripts: Scripts): Scripts | undefined {
  return {
    build: scripts?.build ?? "tsdown",
  };
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
    ...when(context.needsTsdown, { publint: "catalog:", tsdown: "catalog:" }),
    ...when(context.needsEslint, { "typescript-eslint": "catalog:" }),
  };
}

function when<TValue>(condition: boolean, value: TValue): TValue | undefined {
  return condition ? value : undefined;
}
