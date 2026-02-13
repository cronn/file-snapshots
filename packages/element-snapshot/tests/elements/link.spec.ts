import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML link", async ({ page }) => {
  await matchRawElementSnapshot(page, `<a href="/target">Link</a>`);
});
