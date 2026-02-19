import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { setupTransformedSnapshotTest } from "../../src/test/fixtures";

test("includes list elements", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    html`
      <main>
        <p>Text</p>
        <ul>
          <li>Apple</li>
          <li>Pear</li>
        </ul>
        <p>Text</p>
        <ul>
          <li>Carrot</li>
          <li>Broccoli</li>
        </ul>
        <p>Text</p>
      </main>
    `,
  );

  await matchSnapshot({
    filter: (element) => element.role === "list",
  });
});

test("excludes paragraph elements", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    html`
      <main>
        <p>Text</p>
        <ul>
          <li>Apple</li>
          <li>Pear</li>
        </ul>
        <p>Text</p>
        <ul>
          <li>Carrot</li>
          <li>Broccoli</li>
        </ul>
        <p>Text</p>
      </main>
    `,
  );

  await matchSnapshot({
    filter: (element) => element.role !== "paragraph",
    recurseFilter: true,
  });
});
