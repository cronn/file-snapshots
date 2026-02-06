import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("unordered HTML list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
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
    `
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
    `
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
  await matchRawElementSnapshot(page, `<ul></ul>`);
});

test("empty listitem", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <ul>
        <li></li>
      </ul>
    `,
  );
});

test("role-based list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="list">
        <div role="listitem">Apple</div>
        <div role="listitem">Pear</div>
      </div>
    `,
  );
});

test("ignores listitem outside list", async ({ page }) => {
  await matchRawElementSnapshot(page, `<li>Apple</li>`);
});
