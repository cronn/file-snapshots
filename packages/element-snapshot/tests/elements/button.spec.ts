import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML button", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<button>Edit</button>`);
});

test("role-based button", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="button">Edit</div>`);
});

test("button with label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<img role="button" aria-label="Button Name" />`,
  );
});

test("disabled button", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<button disabled>Disabled</button>`);
});

test("aria-disabled button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<button aria-disabled="true">ARIA-Disabled</button>`,
  );
});

test("toggle button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <button aria-pressed="true">Pressed</button>
      <button aria-pressed="mixed">Mixed</button>
      <button aria-pressed="false">Not Pressed</button>
    `,
  );
});

test("expand collapse button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <button aria-expanded="true" aria-controls="description">Expanded</button>
      <button aria-expanded="false" aria-controls="description">
        Collapsed
      </button>
      <p id="description">Description</p>
    `,
  );
});
