import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML separator", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<hr />`);
});

test("role-based separator", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<span role="separator"></span>`);
});

test("role-based separator with text", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span role="separator">Separator</span>`,
  );
});

test("all children are presentational", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="separator">
        <h2>Separator</h2>
      </div>
    `,
  );
});
