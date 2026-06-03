import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML link", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<a href="/target">Link</a>`);
});

test("aria-current attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <a href="/page" aria-current="page">Page</a>
      <a href="/step" aria-current="step">Step</a>
      <a href="/true" aria-current="true">True</a>
      <a href="/false" aria-current="false">False</a>
    `,
  );
});
