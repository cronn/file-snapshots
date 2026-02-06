import test from "@playwright/test";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("resolves implicit role from HTML element", async ({ page }) => {
  await matchRawElementSnapshot(page, `<p></p>`);
});

test("resolves explicit role from role attribute", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="paragraph"></div>`);
});

test("explicit role overrides implicit role", async ({ page }) => {
  await matchRawElementSnapshot(page, `<p role="article"></p>`);
});

test("when role is unknown, returns empty snapshot", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="unknown"></div>`);
});
