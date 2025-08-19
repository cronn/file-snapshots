import path from "node:path";

import type { FilePathResolverParams } from "../types/matcher";
import { normalizeFileName } from "../utils/file";

export function resolveNameAsFile(params: FilePathResolverParams): string {
  return resolveFilePath(params, ({ basePath, normalizedName }) =>
    path.join(basePath, normalizedName),
  );
}

export function resolveNameAsFileSuffix(
  params: FilePathResolverParams,
): string {
  return resolveFilePath(
    params,
    ({ basePath, normalizedName }) => `${basePath}_${normalizedName}`,
  );
}

function resolveBasePath(params: Omit<FilePathResolverParams, "name">): string {
  const { testPath, titlePath } = params;

  const normalizedTitlePath = titlePath.map(normalizeFileName);
  return path.join(testPath, ...normalizedTitlePath);
}

type NamedFilePathResolver = (params: NamedFilePathResolverParams) => string;

interface NamedFilePathResolverParams {
  basePath: string;
  normalizedName: string;
}

function resolveFilePath(
  params: FilePathResolverParams,
  resolveNamedFilePath: NamedFilePathResolver,
): string {
  const { name, ...baseParams } = params;
  const basePath = resolveBasePath(baseParams);

  if (name === undefined) {
    return basePath;
  }

  const normalizedName = normalizeFileName(name);
  return resolveNamedFilePath({ basePath, normalizedName });
}
