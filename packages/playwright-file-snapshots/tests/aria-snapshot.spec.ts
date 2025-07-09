import { test } from "@playwright/test";

import { defineValidationFileExpect, snapshotAria } from "../src";

const expect = defineValidationFileExpect();

test("matches page content with ARIA snapshot", async ({ page }) => {
  await page.goto("/");
  expect(await snapshotAria(page.getByRole("main"))).toMatchJsonFile();
});
