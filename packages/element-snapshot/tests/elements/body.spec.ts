import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { rawSnapshot } from "../../src";
import { expect } from "../../src/test/fixtures";

test("HTML body", async ({ page }) => {
  await setupSnapshotTest(
    page,
    html`
      <head>
        <title>Title</title>
      </head>
      <body>
        <main>Content</main>
      </body>
    `,
  );

  await expect(await rawSnapshot(page)).toMatchJsonFile();
});
