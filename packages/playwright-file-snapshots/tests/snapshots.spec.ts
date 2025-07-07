import test, { Locator } from "@playwright/test";

import { defineValidationFileExpect, snapshotAria, snapshotDom } from "../src";

const expect = defineValidationFileExpect();

async function testSnapshots(locator: Locator): Promise<void> {
  await expect(snapshotAria(locator)).toMatchJsonFile({
    name: "ARIA snapshot",
  });
  await expect(snapshotDom(locator)).toMatchJsonFile({ name: "DOM snapshot" });
}
test("page", async ({ page }) => {
  await page.goto("/");
  await testSnapshots(page.locator("body"));
});

test("headings", async ({ page }) => {
  await page.goto("/headings");
  await testSnapshots(page.getByRole("main"));
});

test("lists", async ({ page }) => {
  await page.goto("/lists");
  await testSnapshots(page.getByRole("main"));
});

test("input types", async ({ page }) => {
  await page.goto("/forms/input-types");
  await testSnapshots(page.getByRole("main"));
});

test("input states", async ({ page }) => {
  await page.goto("/forms/input-states");
  await testSnapshots(page.getByRole("main"));
});

test("label types", async ({ page }) => {
  await page.goto("/forms/label-types");
  await testSnapshots(page.getByRole("main"));
});
