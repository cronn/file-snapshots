import type { Page } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";
import { setupSnapshotTest } from "@cronn/test-utils/playwright";

import { snapshotAria } from "../snapshot";

export const expect = defineValidationFileExpect();

export async function matchAriaSnapshot(
  page: Page,
  content: string,
): Promise<void> {
  const bodyLocator = await setupSnapshotTest(page, content);

  await expect(snapshotAria(bodyLocator)).toMatchJsonFile();
}
