import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML table", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <table>
        <thead>
          <tr>
            <th scope="col">Column Header 1</th>
            <th scope="col">Column Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Row Header 1</th>
            <td>Body Cell 1</td>
          </tr>
          <tr>
            <th scope="row">Row Header 2</th>
            <td>Body Cell 2</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Footer Cell 1</td>
            <td>Footer Cell 2</td>
          </tr>
        </tfoot>
      </table>
    `,
  );
});

test("role-based table", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="table">
        <div role="row">
          <div role="columnheader">Column Header</div>
        </div>
        <div role="rowgroup">
          <div role="row">
            <div role="rowheader">Row Header</div>
            <div role="cell">Cell</div>
          </div>
        </div>
      </div>
    `,
  );
});

test("sorted columnheader", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="table">
        <div role="row">
          <div role="columnheader" aria-sort="ascending">Ascending Sorting</div>
          <div role="columnheader" aria-sort="descending">Descending Sorting</div>
          <div role="columnheader" aria-sort="other">Other Sorting</div>
        </div>
      </div>
    `,
  );
});

test("empty table", async ({ page }) => {
  await matchRawElementSnapshot(page, `<table></table>`);
});

test("empty rowgroup", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <table>
        <tbody></tbody>
      </table>
    `,
  );
});

test("empty row", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <table>
        <tr></tr>
      </table>
    `,
  );
});

test("snapshots empty cells", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <table>
        <tr>
          <th scope="col">Column Header</th>
          <th scope="row">Row Header</th>
          <td></td>
        </tr>
      </table>
    `,
  );
});

test("ignores rowgroup outside table", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="rowgroup">Rowgroup</div>`);
});

test("ignores row outside table", async ({ page }) => {
  await matchRawElementSnapshot(page, `<div role="row">Row</div>`);
});

test("ignores cells outside table", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="columnheader">Column Header</div>
      <div role="rowheader">Row Header</div>
      <div role="cell">Cell</div>
    `,
  );
});

test("ignores cells outside row", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="table">
        <div role="columnheader">Column Header</div>
        <div role="rowheader">Row Header</div>
        <div role="cell">Cell</div>
      </div>
    `,
  );
});
