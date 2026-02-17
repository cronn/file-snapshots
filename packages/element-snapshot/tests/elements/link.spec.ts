import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML link", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<a href="/target">Link</a>`);
});
