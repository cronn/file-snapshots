import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("menu", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <button
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu"
        aria-expanded="true"
      >
        Menu
      </button>
      <ul id="menu" role="menu" aria-labelledby="menubutton">
        <li role="menuitem">Edit</li>
        <li role="menuitem" aria-disabled="true">Delete</li>
        <li role="menuitem" href="/">Help</li>
      </ul>
    `,
  );
});

test("empty menu", async ({ page }) => {
  await matchRawElementSnapshot(page, `<ul role="menu"></ul>`);
});

test("snapshots empty menuitem", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <ul role="menu">
        <li role="menuitem"></li>
      </ul>
    `,
  );
});

test("ignores menuitem outside menu", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="menuitem">Menuitem</div>`);
});
