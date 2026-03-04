import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { markdownTableSnapshot } from "../../src/playwright/markdown-table";
import { expect } from "../../src/test/fixtures";

test("HTML table", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <table>
        <thead>
          <tr>
            <th scope="col">Employee</th>
            <th scope="col">Department</th>
            <th scope="col">Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Alice Johnson</th>
            <td>Engineering</td>
            <td>$95,000</td>
          </tr>
          <tr>
            <th scope="row">Bob Smith</th>
            <td>Marketing</td>
            <td>$75,000</td>
          </tr>
          <tr>
            <th scope="row">Charlie Brown</th>
            <td>Sales</td>
            <td>$80,000</td>
          </tr>
        </tbody>
      </table>
    `,
  );

  await expect(markdownTableSnapshot(bodyLocator)).toMatchTextFile({
    fileExtension: "md",
  });
});

test("role-based grid", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <div role="grid">
        <div role="row">
          <div role="columnheader">Product</div>
          <div role="columnheader">Price</div>
          <div role="columnheader">Stock</div>
        </div>
        <div role="row">
          <div role="gridcell">Laptop</div>
          <div role="gridcell">$999</div>
          <div role="gridcell">15</div>
        </div>
        <div role="row">
          <div role="gridcell">Mouse</div>
          <div role="gridcell">$25</div>
          <div role="gridcell">150</div>
        </div>
      </div>
    `,
  );

  await expect(markdownTableSnapshot(bodyLocator)).toMatchTextFile({
    fileExtension: "md",
  });
});

test("sorted column headers", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <table>
        <thead>
          <tr>
            <th scope="col" aria-sort="ascending">Name</th>
            <th scope="col" aria-sort="descending">Score</th>
            <th scope="col" aria-sort="other">Status</th>
            <th scope="col">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>95</td>
            <td>Active</td>
            <td>A</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>88</td>
            <td>Inactive</td>
            <td>B</td>
          </tr>
        </tbody>
      </table>
    `,
  );

  await expect.soft(markdownTableSnapshot(bodyLocator)).toMatchTextFile({
    name: "show sort indicator",
    fileExtension: "md",
  });
  await expect
    .soft(markdownTableSnapshot(bodyLocator, { showSortIndicator: false }))
    .toMatchTextFile({
      name: "hide sort indicator",
      fileExtension: "md",
    });
});

test("when multiple tables are found, throws error", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <table>
        <tr>
          <th>Column 1</th>
        </tr>
      </table>
      <table>
        <tr>
          <th>Column 2</th>
        </tr>
      </table>
    `,
  );

  await expect(markdownTableSnapshot(bodyLocator)).rejects.toThrow(
    "Multiple tables or grids found",
  );
});

test("when no table is found, throws error", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`<div>No table here</div>`,
  );

  await expect(markdownTableSnapshot(bodyLocator)).rejects.toThrow(
    "No table or grid found",
  );
});

test("when no header row is found, throws error", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, html`<table></table>`);

  await expect(markdownTableSnapshot(bodyLocator)).rejects.toThrow(
    "No header row found",
  );
});

test("when no column headers are found, throws error", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <table>
        <tr>
          <td>Cell without header</td>
        </tr>
      </table>
    `,
  );

  await expect(markdownTableSnapshot(bodyLocator)).rejects.toThrow(
    "No column headers found",
  );
});
