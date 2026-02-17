import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("unordered HTML list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul>
        <li>Apple</li>
        <li>Pear</li>
      </ul>
    `,
  );
});

test("ordered HTML list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ol>
        <li>Apple</li>
        <li>Pear</li>
      </ol>
    `,
  );
});

test("nested list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul>
        <li>
          Fruits
          <ul>
            <li>Apple</li>
            <li>Pear</li>
          </ul>
        </li>
      </ul>
    `,
  );
});

test("empty list", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<ul></ul>`);
});

test("empty listitem", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul>
        <li></li>
      </ul>
    `,
  );
});

test("role-based list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="list">
        <div role="listitem">Apple</div>
        <div role="listitem">Pear</div>
      </div>
    `,
  );
});

test("ignores listitem outside list", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<li>Apple</li>`);
});
