import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { expect } from "../../src/test/fixtures";
import { excludeRole, includeRole } from "../../src/utils/predicates";

test("includes list elements", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
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

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    filter: includeRole("list"),
  });
});

test("excludes paragraph elements", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
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

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    filter: excludeRole("paragraph"),
    recurseFilter: true,
  });
});
