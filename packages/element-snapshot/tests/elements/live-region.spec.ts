import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("alert", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="alert">Alert</div>`);
});
