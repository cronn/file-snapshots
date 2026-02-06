import type { Locator, Page } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

import { snapshotAria } from "../snapshot";

export const expect = defineValidationFileExpect();

export async function matchAriaSnapshot(
  page: Page,
  content: string,
): Promise<void> {
  const bodyLocator = await setupSnapshotTest(page, content);

  await expect(snapshotAria(bodyLocator)).toMatchJsonFile();
}
async function setupSnapshotTest(
  page: Page,
  content: string,
): Promise<Locator> {
  await page.setContent(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Test Page</title>
  </head>
  <body>
    ${content}
  </body>
</html>
`);

  return page.locator("body");
}
