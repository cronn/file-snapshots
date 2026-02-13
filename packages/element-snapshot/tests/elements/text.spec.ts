import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("text", async ({ page }) => {
  await matchRawElementSnapshot(page, "Text");
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
  await matchRawElementSnapshot(page, "");
});

test("HTML paragraph", async ({ page }) => {
  await matchRawElementSnapshot(page, `<p>Paragraph</p>`);
});

test("empty paragraph", async ({ page }) => {
  await matchRawElementSnapshot(page, `<p></p>`);
});

test("HTML span", async ({ page }) => {
  await matchRawElementSnapshot(page, `<span>Span</span>`);
});
