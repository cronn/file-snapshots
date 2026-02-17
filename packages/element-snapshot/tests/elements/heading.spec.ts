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
