import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("heading levels", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <h1>h1 Heading</h1>
      <h2>h2 Heading</h2>
      <h3>h3 Heading</h3>
      <h4>h4 Heading</h4>
      <h5>h5 Heading</h5>
      <h6>h6 Heading</h6>
    `,
  );
});

test("empty heading", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<h1></h1>`);
});

test("native heading with aria-level", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <h2 aria-level="3">Overridden level</h2>
      <h2 aria-level="0">Invalid level</h2>
      <h2 aria-level="abc">Non-numeric level</h2>
    `,
  );
});

test("role-based heading", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="heading" aria-level="3">With level</div>
      <div role="heading">Without level</div>
      <div role="heading" aria-level="2">Settings <a href="/help">Help</a></div>
    `,
  );
});
