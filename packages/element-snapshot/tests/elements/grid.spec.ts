import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("grid", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="grid">
        <div role="row">
          <div role="columnheader">Column Header 1</div>
          <div role="columnheader">Column Header 2</div>
        </div>
        <div role="rowgroup">
          <div role="row">
            <div role="rowheader">Row Header 1</div>
            <div role="gridcell">Grid Cell 1</div>
          </div>
          <div role="row">
            <div role="rowheader">Row Header 2</div>
            <div role="gridcell">Grid Cell 2</div>
          </div>
        </div>
      </div>
    `,
  );
});

test("empty grid", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="grid"></div>`);
});

test("empty gridcell", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="grid">
        <div role="row">
          <div role="gridcell"></div>
        </>
      </div>
    `,
  );
});

test("ignores rowgroup outside grid", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<div role="rowgroup">Rowgroup</div>`,
  );
});

test("ignores row outside grid", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="row">Row</div>`);
});

test("ignores cells outside grid", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="columnheader">Column Header</div>
      <div role="rowheader">Row Header</div>
      <div role="gridcell">Grid Cell</div>
    `,
  );
});

test("ignores cells outside row", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="grid">
        <div role="columnheader">Column Header</div>
        <div role="rowheader">Row Header</div>
        <div role="gridcell">Grid Cell</div>
      </div>
    `,
  );
});
