import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("text", async ({ page }) => {
  await matchRawElementSnapshot(page, `Text`);
});

test("multiline text", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
    First Line
    Second Line
  `,
  );
});

test("empty text", async ({ page }) => {
  await matchRawElementSnapshot(page, ``);
});

test("HTML paragraph", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<p>Paragraph</p>`);
});

test("empty paragraph", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<p></p>`);
});

test("HTML span", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<span>Span</span>`);
});
