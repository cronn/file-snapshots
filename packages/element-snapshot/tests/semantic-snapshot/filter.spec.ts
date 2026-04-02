import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { setupSemanticSnapshotTest } from "../../src/test/fixtures";
import { excludeRole, includeRole } from "../../src/utils/predicates";

test("includes list elements", async ({ page }) => {
  const matchSnapshot = await setupSemanticSnapshotTest(
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
    filter: includeRole("list"),
  });
});

test("excludes paragraph elements", async ({ page }) => {
  const matchSnapshot = await setupSemanticSnapshotTest(
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
    filter: excludeRole("paragraph"),
    recurseFilter: true,
  });
});
