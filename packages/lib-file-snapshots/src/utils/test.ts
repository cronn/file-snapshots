import { rmSync } from "node:fs";
import path from "node:path";
import { type TestContext, expect } from "vitest";

import type { SnapshotSerializer } from "../types/serializer";

import { normalizeFileName } from "./file";

export const TMP_DIR = "./.tmp";

export const SNAPSHOTS_DIR = "__snapshots__";

export type SerializerTestFn = (context: TestContext) => Promise<void>;

export function testSerializer(
  serializer: SnapshotSerializer,
  value: unknown,
): SerializerTestFn {
  return async (context): Promise<void> => {
    const { testFileName, testName } = resolveTestContext(context);
    const serializedValue = serializer.serialize(value);
    const normalizedTestName = normalizeFileName(testName);

    expect(serializer.canSerialize(value)).toBe(true);
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

export function testSerializerThrows(
  serializer: SnapshotSerializer,
  value: unknown,
): () => void {
  return (): void => {
    expect(serializer.canSerialize(value)).toBe(false);
    expect(() => serializer.serialize(value)).toThrowError();
  };
}

export class FailingSerializer implements SnapshotSerializer {
  public readonly fileExtension = "error";

  public canSerialize(_value: unknown): boolean {
    return false;
  }

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

export function cleanTmpDir(): void {
  rmSync(TMP_DIR, { recursive: true, force: true });
}
