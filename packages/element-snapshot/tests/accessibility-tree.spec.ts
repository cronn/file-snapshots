import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("element with aria-hidden=true attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<p aria-hidden="true">Paragraph</p>`,
  );
});

test("element with aria-hidden=false attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<p aria-hidden="false">Paragraph</p>`,
  );
});

test("element with role=presentation attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<p role="presentation">Paragraph</p>`,
  );
});

test("element with role=none attribute", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<p role="none">Paragraph</p>`);
});
