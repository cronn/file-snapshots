import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("role-based toolbar", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="toolbar">
        <button>Bold</button>
        <button>Italic</button>
      </div>
    `,
  );
});

test("role-based toolbar with accessible name", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="toolbar" aria-label="Text formatting">
        <button>Bold</button>
        <button>Italic</button>
      </div>
    `,
  );
});

test("empty toolbar", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="toolbar"></div>`);
});
