import { createUpdateOptions } from "@pnpm/meta-updater";
import fs from "node:fs";
import path from "node:path";

export default function () {
  return createUpdateOptions({
    files: {
      "package.json": updatePackageJson,
    },
  });
}

/**
 *
 * @param {PackageJson} manifest
 * @param {FormatPluginFnOptions} options
 */
function updatePackageJson(manifest, { dir }) {
  /**
   * @param {TValue} value
   * @param {TFallbackValue} fallbackValue
   * @return {TValue | TFallbackValue}
   */
  function whenPublic(value, fallbackValue = undefined) {
    if (manifest.private) {
      return fallbackValue;
    }

    return value;
  }

  /**
   * @param {TValue} value
   * @param {(value: TValue) => TValue} updater
   * @return {TValue}
   */
  function updateWhenPublic(value, updater) {
    if (manifest.private) {
      return value;
    }

    return updater(value);
  }

  return {
    ...manifest,
    bugs: whenPublic({
      url: "https://github.com/cronn/file-snapshots/issues",
    }),
    author: "cronn",
    license: "Apache-2.0",
    repository: defineRepository(dir),
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
    scripts: updateWhenPublic(manifest.scripts, (scripts) =>
      updateScripts(scripts, dir),
    ),
    type: "module",
    devDependencies: updateWhenPublic(
      manifest.devDependencies,
      updateDevDependencies,
    ),
  };
}

/**
 * @param {string} packageDir
 * @returns {Object}
 */
function defineRepository(packageDir) {
  const relativeDir = toRelativeDir(packageDir);
  const baseReposistory = {
    type: "git",
    url: "https://github.com/cronn/file-snapshots.git",
  };

  if (relativeDir === "") {
    return baseReposistory;
  }

  return {
    ...baseReposistory,
    directory: relativeDir,
  };
}

/**
 * @param {string} absolutePackageDir
 * @return {string}
 */
function toRelativeDir(absoluteDir) {
  const rootDir = path.resolve(import.meta.dirname, "..");
  return path.relative(rootDir, absoluteDir).replace(/\\/g, "/");
}

/**
 * @param {PackageJson.Scripts | undefined} scripts
 * @param {string} packageDir
 * @param {boolean} isPrivatePackage
 * @returns {PackageJson.Scripts | undefined}
 */
function updateScripts(scripts, packageDir) {
  const lintedDirs = ["src/", "tests/"]
    .filter((lintedDir) => fs.existsSync(path.resolve(packageDir, lintedDir)))
    .join(" ");
  return {
    ...scripts,
    "lint:check": `eslint ${lintedDirs} --max-warnings=0`,
    "lint:fix": `eslint ${lintedDirs} --max-warnings=0 --fix`,
    compile: "tsc",
  };
}

/**
 * @param {PackageJson.Dependency | undefined} devDependencies
 * @param {boolean} isPrivatePackage
 * @returns {PackageJson.Dependency | undefined}
 */
function updateDevDependencies(devDependencies) {
  return {
    ...devDependencies,
    "@arethetypeswrong/core": "catalog:",
    "@trivago/prettier-plugin-sort-imports": "catalog:",
    eslint: "catalog:",
    "eslint-config-prettier": "catalog:",
    "eslint-plugin-unused-imports": "catalog:",
    prettier: "catalog:",
    publint: "catalog:",
    tsdown: "catalog:",
    typescript: "catalog:",
    "typescript-eslint": "catalog:",
  };
}
