import test from "@playwright/test";

import type { Normalizer } from "@cronn/lib-file-snapshots";
import { maskPattern, stringNormalizer } from "@cronn/lib-file-snapshots";
import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { markdownTableSnapshot } from "../../src/playwright/markdown-table";
import { expect } from "../../src/test/fixtures";

const DATED_TABLE = html`
  <table>
    <tr>
      <th scope="col">Order</th>
      <th scope="col">Created at</th>
    </tr>
    <tr>
      <td>#1001</td>
      <td>2024-05-01</td>
    </tr>
    <tr>
      <td>#1002</td>
      <td>2024-05-02</td>
    </tr>
  </table>
`;

function maskDate(): Normalizer<string> {
  return maskPattern(/\d{4}-\d{2}-\d{2}/g, (index) => `<DATE_${index}>`);
}

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

  await expect(bodyLocator).toMatchMarkdownTableSnapshotFile();
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

  await expect(bodyLocator).toMatchMarkdownTableSnapshotFile();
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

  await expect.soft(bodyLocator).toMatchMarkdownTableSnapshotFile({
    name: "show sort indicator",
  });
  await expect.soft(bodyLocator).toMatchMarkdownTableSnapshotFile({
    name: "hide sort indicator",
    showSortIndicator: false,
  });
});

test("normalizers", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, DATED_TABLE);

  await expect.soft(bodyLocator).toMatchMarkdownTableSnapshotFile({
    normalizers: [stringNormalizer(maskDate())],
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

  await expect(() =>
    expect(bodyLocator).toMatchMarkdownTableSnapshotFile(),
  ).rejects.toThrow("Multiple tables or grids found");
});

test("when no table is found, throws error", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`<div>No table here</div>`,
  );

  await expect(() =>
    expect(bodyLocator).toMatchMarkdownTableSnapshotFile(),
  ).rejects.toThrow("No table or grid found");
});

test("when no header row is found, throws error", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, html`<table></table>`);

  await expect(() =>
    expect(bodyLocator).toMatchMarkdownTableSnapshotFile(),
  ).rejects.toThrow("No header row found");
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

  await expect(() =>
    expect(bodyLocator).toMatchMarkdownTableSnapshotFile(),
  ).rejects.toThrow("No column headers found");
});

test("snapshot function", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>95</td>
          </tr>
        </tbody>
      </table>
    `,
  );

  await expect(markdownTableSnapshot(bodyLocator)).toMatchTextFile({
    fileExtension: "md",
  });
});

test("snapshot function with normalizers", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, DATED_TABLE);

  await expect(
    markdownTableSnapshot(bodyLocator, {
      normalizers: [stringNormalizer(maskDate())],
    }),
  ).toMatchTextFile({ fileExtension: "md" });
});
