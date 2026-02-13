import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML image", async ({ page }) => {
  await matchRawElementSnapshot(page, `<img src="image.jpg" />`);
});

test("HTML image with alt text", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<img src="image.jpg" alt="Alternative text" />`,
  );
});

test("SVG image", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        stroke="red"
      >
        <circle cx="50" cy="50" r="40" />
      </svg>
    `,
  );
});

test("role-based image", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<div role="img" aria-label="Label"></div>`,
  );
});

test("role-based image with text content", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="img">Text</div>`);
});
