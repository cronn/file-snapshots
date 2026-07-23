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

test("HTML insertion", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<ins>Inserted</ins>`);
});

test("HTML deletion", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<del>Deleted</del>`);
});

test("HTML mark", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<mark>Highlighted</mark>`);
});

test("HTML subscript", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<sub>Subscripted</sub>`);
});

test("HTML superscript", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<sup>Superscripted</sup>`);
});

test("role-based insertion", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span role="insertion">Inserted</span>`,
  );
});

test("role-based deletion", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span role="deletion">Deleted</span>`,
  );
});

test("role-based mark", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span role="mark">Highlighted</span>`,
  );
});

test("role-based subscript", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span role="subscript">Subscripted</span>`,
  );
});

test("role-based superscript", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<span role="superscript">Superscripted</span>`,
  );
});
