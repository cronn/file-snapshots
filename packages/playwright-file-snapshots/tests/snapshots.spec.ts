import type { Locator } from "@playwright/test";
import test from "@playwright/test";

import { snapshotElement } from "@cronn/element-snapshot";

import { defineValidationFileExpect, snapshotAria } from "../src";

const expect = defineValidationFileExpect();

async function testSnapshots(locator: Locator): Promise<void> {
  await expect.soft(snapshotAria(locator)).toMatchJsonFile({
    name: "ARIA snapshot",
  });
  await expect
    .soft(snapshotElement(locator))
    .toMatchJsonFile({ name: "Element snapshot" });
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

test("placeholders", async ({ page }) => {
  await page.goto("/forms/placeholders");
  await testSnapshots(page.getByRole("main"));
});

test("include combobox options", async ({ page }) => {
  await page.goto("/forms/input-types");
  await expect(
    snapshotElement(page.getByLabel("Multi Select"), {
      includeComboboxOptions: true,
    }),
  ).toMatchJsonFile({ name: "select" });

  await page.goto("/forms/comboboxes");
  await expect(
    snapshotElement(page.getByLabel("Expanded Combobox"), {
      includeComboboxOptions: true,
    }),
  ).toMatchJsonFile({ name: "expanded combobox" });
  await expect(
    snapshotElement(page.getByLabel("Collapsed Combobox"), {
      includeComboboxOptions: true,
    }),
  ).toMatchJsonFile({ name: "collapsed combobox" });
});

test("accessibility tree", async ({ page }) => {
  await page.goto("/accessibility-tree");
  await testSnapshots(page.getByRole("main"));
});

test("unsupported elements", async ({ page }) => {
  await page.goto("/unsupported-elements");
  await testSnapshots(page.getByRole("main"));
});

test("dialogs", async ({ page }) => {
  await page.goto("/dialogs");
  await testSnapshots(page.getByRole("main"));
});

test("live regions", async ({ page }) => {
  await page.goto("/live-regions");
  await testSnapshots(page.getByRole("main"));
});

test("visually hidden elements", async ({ page }) => {
  await page.goto("/visually-hidden-elements");
  await testSnapshots(page.getByRole("main"));
});

test("tabs", async ({ page }) => {
  await page.goto("/tabs");
  await testSnapshots(page.getByRole("main"));
});

test("buttons", async ({ page }) => {
  await page.goto("/buttons");
  await testSnapshots(page.getByRole("main"));
});

test("groups", async ({ page }) => {
  await page.goto("/groups");
  await testSnapshots(page.getByRole("main"));
});

test("progressbars", async ({ page }) => {
  await page.goto("/progressbars");
  await testSnapshots(page.getByRole("main"));
});
