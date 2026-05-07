import type { Page } from "@playwright/test";
import { mergeExpects } from "@playwright/test";

import type { PlaywrightValidationFileMatcherConfig } from "@cronn/playwright-file-snapshots";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";
import { setupSnapshotTest } from "@cronn/test-utils/playwright";

import { defineElementSnapshotMatchers } from "../playwright/matchers";
import { rawSnapshot } from "../playwright/snapshot";

const config: PlaywrightValidationFileMatcherConfig = {
  validationDir: "data/integration-test/validation",
  outputDir: "data/integration-test/output",
};

export const expect = mergeExpects(
  defineValidationFileExpect(config),
  defineElementSnapshotMatchers(config),
);

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
