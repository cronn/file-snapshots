import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML image with alt text", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<img src="image.jpg" alt="Alternative text" />`,
  );
});

test("role-based image with label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<svg
      role="img"
      aria-label="Label"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      stroke="red"
    >
      <circle cx="50" cy="50" r="40" />
    </svg>`,
  );
});

test("role-based image with text content", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="img">Text</div>`);
});

test("ignores image without name", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<img src="image.jpg" />`);
});

test("ignores SVG element without role", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      stroke="red"
    >
      <circle cx="50" cy="50" r="40" />
    </svg>`,
  );
});
