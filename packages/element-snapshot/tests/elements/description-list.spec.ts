import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML description list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <dl>
        <dt>Coffee</dt>
        <dd>A brewed drink prepared from roasted coffee beans</dd>

        <dt>Tea</dt>
        <dd>A beverage made by steeping dried leaves in hot water</dd>
        <dd>An afternoon meal or social gathering, typically in British culture</dd>
      </dl>
    `,
  );
});

test("role-based description list", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <dl>
        <div role="term">Coffee</div>
        <div role="definition">A brewed drink prepared from roasted coffee beans</div>
      </dl>
    `,
  );
});

test("empty description list", async ({ page }) => {
  await matchRawElementSnapshot(page, `<dl></dl>`);
});

test("empty term", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <dl>
        <dt></dt>
      </dl>`,
  );
});

test("empty definition", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <dl>
        <dd></dd>
      </dl>`,
  );
});

test("ignores term outside description list", async ({ page }) => {
  await matchRawElementSnapshot(page, `<dt>Term</dt>`);
});

test("ignores definition outside description list", async ({ page }) => {
  await matchRawElementSnapshot(page, `<dd>Definition</dd>`);
});
