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

test("consecutive text nodes", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span>First</span><span>Second</span>
      <hr />
      <span>Third</span><span>Fourth</span>`,
  );
});

test("HTML strong", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<strong>Important</strong>`);
});

test("HTML emphasis", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<em>Emphasized</em>`);
});

test("HTML code", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<code>const x = 1;</code>`);
});

test("HTML blockquote", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<blockquote>Quoted text</blockquote>`,
  );
});

test("HTML blockquote with accessible name", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<blockquote aria-label="Citation">Quoted text</blockquote>`,
  );
});
