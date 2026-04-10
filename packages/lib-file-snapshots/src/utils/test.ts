import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { type TestContext, expect } from "vitest";

import type { SnapshotSerializer } from "../types/serializer";

import { normalizeFileName } from "./file";

export const SNAPSHOTS_DIR = "__snapshots__";

export type SerializerTestFn = (context: TestContext) => Promise<void>;

export function testSerializer<TValue>(
  serializer: SnapshotSerializer<TValue>,
  value: TValue,
): SerializerTestFn {
  return async (context): Promise<void> => {
    const { testFileName, testName } = resolveTestContext(context);
    const serializedValue = serializer.serialize(value);
    const normalizedTestName = normalizeFileName(testName);

    await expect(serializedValue).toMatchFileSnapshot(
      path.join(
        ".",
        SNAPSHOTS_DIR,
        testFileName,
        `${normalizedTestName}.${serializer.fileExtension}`,
      ),
    );
  };
}

export class FailingSerializer implements SnapshotSerializer<unknown> {
  public readonly fileExtension = "error";

  public serialize(_value: unknown): string {
    throw new Error("Not implemented");
  }
}

interface ResolvedTestContext {
  testFileName: string;
  testName: string;
}

export function resolveTestContext(context: TestContext): ResolvedTestContext {
  return {
    testFileName: path
      .basename(context.task.file.name)
      .replace(/\.test.ts$/, ""),
    testName: context.task.name,
  };
}

export function createTmpDir(): string {
  return mkdtempSync(path.join(tmpdir(), "test-"));
}

function maskTmpDir(filePath: string, tmpDir: string): string {
  return filePath.replaceAll(tmpDir, "[TMP_DIR]");
}

export function normalizePath(value: string, tmpDir?: string): string {
  let normalizedValue = value;

  if (tmpDir !== undefined) {
    normalizedValue = maskTmpDir(normalizedValue, tmpDir);
  }

  if (path.sep !== "/") {
    normalizedValue = normalizedValue.replace(/\\/g, "/");
  }

  return normalizedValue;
}
