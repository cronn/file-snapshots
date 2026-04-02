import type { Page } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";
import { setupSnapshotTest } from "@cronn/test-utils/playwright";

import type { SemanticSnapshotOptions } from "../playwright/snapshot";
import { rawSnapshot, semanticSnapshot } from "../playwright/snapshot";

export const expect = defineValidationFileExpect({
  validationDir: "data/integration-test/validation",
  outputDir: "data/integration-test/output",
});

export async function matchRawElementSnapshot(
  page: Page,
  content: string,
): Promise<void> {
  const bodyLocator = await setupSnapshotTest(page, content);

  await expect(rawSnapshot(bodyLocator)).toMatchJsonFile();
}

export async function matchEmptyRawElementSnapshot(
  page: Page,
  content: string,
): Promise<void> {
  const bodyLocator = await setupSnapshotTest(page, content);

  await expect(rawSnapshot(bodyLocator)).resolves.toEqual([]);
}

type ElementSnapshotMatcher = (
  options?: SemanticSnapshotOptions,
) => Promise<void>;

export async function setupSemanticSnapshotTest(
  page: Page,
  content: string,
): Promise<ElementSnapshotMatcher> {
  const bodyLocator = await setupSnapshotTest(page, content);

  return (options) =>
    expect(semanticSnapshot(bodyLocator, options)).toMatchJsonFile();
}
