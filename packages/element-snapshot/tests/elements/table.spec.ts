import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML table", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
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
    html`
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
    html`
      <div role="table">
        <div role="row">
          <div role="columnheader" aria-sort="ascending">Ascending Sorting</div>
          <div role="columnheader" aria-sort="descending">
            Descending Sorting
          </div>
          <div role="columnheader" aria-sort="other">Other Sorting</div>
        </div>
      </div>
    `,
  );
});

test("spanning cells", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tr>
          <th scope="col" rowspan="2">Column Header 1</th>
          <th scope="col" colspan="2">Column Header 2</th>
        </tr>
        <tr>
          <th scope="col">Column Header 3</th>
          <th scope="col">Column Header 4</th>
        </tr>
        <tr>
          <td colspan="2" rowspan="2">Data Cell 1</td>
          <td>Data Cell 2</td>
        </tr>
        <tr>
          <td>Data Cell 3</td>
        </tr>
      </table>
    `,
  );
});

test("colgroup header", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <colgroup></colgroup>
        <colgroup span="2"></colgroup>
        <thead>
          <tr>
            <th scope="col" rowspan="2">Column Header 1</th>
            <th scope="colgroup" colspan="2">Column Group Header</th>
          </tr>
          <tr>
            <th scope="col">Column Header 2</th>
            <th scope="col">Column Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Body Cell 1</td>
            <td>Body Cell 2</td>
            <td>Body Cell 3</td>
          </tr>
        </tbody>
      </table>
    `,
  );
});

test("rowgroup header", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tr>
          <th scope="rowgroup" rowspan="2">Row Group Header</th>
          <td>Body Cell 1</th>
        </tr>
        <tr>
          <td>Body Cell 2</td>
        </tr>
      </table>
    `,
  );
});

test("implicit column header", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tr>
          <th>Column Header 1</th>
          <th>Column Header 2</th>
        </tr>
      </table>
    `,
  );
});

test("implicit row header", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tr>
          <th>Row Header</th>
          <td>Data Cell</td>
        </tr>
      </table>
    `,
  );
});

/**
 * This test just asserts the behavior of the simplified cell scope resolver.
 * The used algorithm does not fulfill the HTML specification for complex and invalid cases.
 *
 * @see https://html.spec.whatwg.org/multipage/tables.html#forming-a-table
 */
test("alternating cell types", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tr>
          <th>Header Cell 1</th>
          <td>Data Cell 1</td>
          <th>Header Cell 2</th>
        </tr>
      </table>
    `,
  );
});

test("empty table", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<table></table>`);
});

test("empty rowgroup", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tbody></tbody>
      </table>
    `,
  );
});

test("empty row", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <table>
        <tr></tr>
      </table>
    `,
  );
});

test("snapshots empty cells", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
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
  await matchRawElementSnapshot(
    page,
    html`<div role="rowgroup">Rowgroup</div>`,
  );
});

test("ignores row outside table", async ({ page }) => {
  await matchRawElementSnapshot(page, html`<div role="row">Row</div>`);
});

test("ignores cells outside table", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="columnheader">Column Header</div>
      <div role="rowheader">Row Header</div>
      <div role="cell">Cell</div>
    `,
  );
});

test("ignores cells outside row", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="table">
        <div role="columnheader">Column Header</div>
        <div role="rowheader">Row Header</div>
        <div role="cell">Cell</div>
      </div>
    `,
  );
});
