import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("tree", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="tree" aria-label="Tree">
        <li role="treeitem" aria-expanded="true" aria-selected="true">
          <span>Fruits</span>
          <ul role="group">
            <li role="treeitem">Apple</li>
            <li role="treeitem" aria-selected="false">Pear</li>
            <li role="treeitem" aria-disabled="true">Banana</li>
          </ul>
        </li>
        <li role="treeitem" aria-expanded="false">
          <span>Vegetables</span>
          <ul role="group" hidden>
            <li role="treeitem">Carrot</li>
          </ul>
        </li>
      </ul>
    `,
  );
});

test("tree with checkboxes", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="tree" aria-label="Tree">
        <li role="treeitem" aria-expanded="true" aria-checked="mixed">
          <span>Fruits</span>
          <ul role="group">
            <li role="treeitem" aria-checked="true">Apple</li>
            <li role="treeitem" aria-checked="false">Pear</li>
          </ul>
        </li>
      </ul>
    `,
  );
});

test("empty tree", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<ul role="tree"></ul>`);
});

test("empty treeitem", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="tree">
        <li role="treeitem"></li>
      </ul>
    `,
  );
});

test("ignores treeitem outside tree", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="treeitem">Treeitem</div>`,
  );
});
