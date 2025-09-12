import type { Locator } from "@playwright/test";
import test from "@playwright/test";

import { defineValidationFileExpect, snapshotAria, snapshotDom } from "../src";

const expect = defineValidationFileExpect();

async function testSnapshots(locator: Locator): Promise<void> {
  await expect.soft(snapshotAria(locator)).toMatchJsonFile({
    name: "ARIA snapshot",
  });
  await expect
    .soft(snapshotDom(locator))
    .toMatchJsonFile({ name: "DOM snapshot" });
}

test("page", async ({ page }) => {
  await page.goto("/");
  await testSnapshots(page.locator("body"));
});

test("role types", async ({ page }) => {
  await page.goto("/role-types");
  await testSnapshots(page.getByRole("main"));
});

test("headings", async ({ page }) => {
  await page.goto("/headings");
  await testSnapshots(page.getByRole("main"));
});

test("lists", async ({ page }) => {
  await page.goto("/lists");
  await testSnapshots(page.getByRole("main"));
});

test("description lists", async ({ page }) => {
  await page.goto("/description-lists");
  await testSnapshots(page.getByRole("main"));
});

test("tables", async ({ page }) => {
  await page.goto("/tables");
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

test("description types", async ({ page }) => {
  await page.goto("/forms/description-types");
  await testSnapshots(page.getByRole("main"));
});

test("comboboxes", async ({ page }) => {
  await page.goto("/forms/comboboxes");
  await testSnapshots(page.getByRole("main"));
});

test("include combobox options", async ({ page }) => {
  await page.goto("/forms/input-types");
  await expect(
    snapshotDom(page.getByLabel("Multi Select"), {
      includeComboboxOptions: true,
    }),
  ).toMatchJsonFile({ name: "select" });

  await page.goto("/forms/comboboxes");
  await expect(
    snapshotDom(page.getByLabel("Expanded Combobox"), {
      includeComboboxOptions: true,
    }),
  ).toMatchJsonFile({ name: "expanded combobox" });
  await expect(
    snapshotDom(page.getByLabel("Collapsed Combobox"), {
      includeComboboxOptions: true,
    }),
  ).toMatchJsonFile({ name: "collapsed combobox" });
});

test("accessibility tree", async ({ page }) => {
  await page.goto("/accessibility-tree");
  await testSnapshots(page.getByRole("main"));
});
