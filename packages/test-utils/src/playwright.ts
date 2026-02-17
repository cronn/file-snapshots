import type { Locator, Page } from "@playwright/test";

export async function setupSnapshotTest(
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
