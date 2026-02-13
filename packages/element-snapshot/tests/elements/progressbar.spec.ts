import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML progressbar", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<progress value="70" max="100">70%</progress>`,
  );
});

test("role-based progressbar", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <span
        role="progressbar"
        aria-label="Loading…"
        aria-valuenow="70"
        aria-valuemax="100"
      >
        70%
      </span>
  `,
  );
});

test("empty progressbar", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="progressbar"></div>`);
});
