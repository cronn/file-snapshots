import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML progressbar", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<progress value="70" max="100">70%</progress>`,
  );
});

test("role-based progressbar", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <span
        role="progressbar"
        aria-label="Loading…"
        aria-valuenow="70"
        aria-valuemax="100"
      >
        70%
      </span>
    `,
  );
});

test("empty progressbar", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="progressbar"></div>`);
});
