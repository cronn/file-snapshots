import type { Page } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";
import { setupSnapshotTest } from "@cronn/test-utils/playwright";

import type { ElementSnapshotOptions } from "../playwright/snapshot";
import { snapshotElement, snapshotElementRaw } from "../playwright/snapshot";

export const expect = defineValidationFileExpect();

export async function matchRawElementSnapshot(
  page: Page,
  content: string,
): Promise<void> {
  const bodyLocator = await setupSnapshotTest(page, content);

  await expect(snapshotElementRaw(bodyLocator)).toMatchJsonFile();
}

type ElementSnapshotMatcher = (
  options?: ElementSnapshotOptions,
) => Promise<void>;

export async function setupTransformedSnapshotTest(
  page: Page,
  content: string,
): Promise<ElementSnapshotMatcher> {
  const bodyLocator = await setupSnapshotTest(page, content);

  return (options) =>
    expect(snapshotElement(bodyLocator, options)).toMatchJsonFile();
}
