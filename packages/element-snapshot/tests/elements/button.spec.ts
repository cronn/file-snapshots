import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML button", async ({ page }) => {
  await matchRawElementSnapshot(page, `<button>Edit</button>`);
});

test("role-based button", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role=button>Edit</div>`);
});

test("button with label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<img role="button" aria-label="Button Name"/>`,
  );
});

test("disabled button", async ({ page }) => {
  await matchRawElementSnapshot(page, `<button disabled>Disabled</button>`);
});

test("aria-disabled button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<button aria-disabled="true">ARIA-Disabled</button>`,
  );
});

test("toggle button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <button aria-pressed="true">Pressed</button>
      <button aria-pressed="mixed">Mixed</button>
      <button aria-pressed="false">Not Pressed</button>
    `,
  );
});

test("expand collapse button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <button aria-expanded="true" aria-controls="description">Expanded</button>
      <button aria-expanded="false" aria-controls="description">Collapsed</button>
      <p id="description">Description</p>
    `,
  );
});
