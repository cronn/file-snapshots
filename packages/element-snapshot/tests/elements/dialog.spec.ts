import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("dialog", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div
        role="dialog"
        aria-labelledby="title"
        aria-describedby="description"
      >
        <h2 id="title">Dialog</h2>
        <p id="description">Description</p>
      </div>
    `,
  );
});

test("modal dialog", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div
        role="dialog"
        aria-modal="true"
      >
        Modal Dialog
      </div>
    `,
  );
});

test("alert dialog", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div
        role="alertdialog"
      >
        Alert Dialog
      </div>
    `,
  );
});

test("empty dialog", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="dialog"></div>`);
});
