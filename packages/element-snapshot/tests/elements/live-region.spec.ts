import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("alert", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="alert">Alert</div>`);
});
