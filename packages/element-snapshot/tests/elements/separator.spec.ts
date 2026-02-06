import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML separator", async ({ page }) => {
  await matchRawElementSnapshot(page, `<hr />`);
});

test("role-based separator", async ({ page }) => {
  await matchRawElementSnapshot(page, `<span role="separator"></span>`);
});

test("role-based separator with text", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<span role="separator">Separator</span>`,
  );
});
