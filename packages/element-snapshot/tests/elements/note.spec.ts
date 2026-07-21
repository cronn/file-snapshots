import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("role-based note", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="note">Ancillary information</div>`,
  );
});

test("role-based note with accessible name", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="note" aria-label="Disclaimer">Ancillary information</div>`,
  );
});
