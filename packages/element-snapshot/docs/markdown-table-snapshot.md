# Markdown Table Snapshots

The `markdownTableSnapshot` function creates a readable Markdown table representation from HTML `<table>` elements or ARIA `grid` elements. This format is ideal for snapshot testing of tabular data in a human-readable format.

## Purpose

Markdown table snapshots provide:

- **Human-readable output**: Tables are rendered in Markdown format, making test snapshots easy to review
- **Table-specific testing**: Focus on tabular data structure and content without the noise of full element snapshots
- **Sort indicator support**: Optionally display sorting state for sortable column headers

## Usage

```ts
import { markdownTableSnapshot } from "@cronn/element-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("matches table snapshot", async ({ page }) => {
  await expect(markdownTableSnapshot(page.getByRole("table"))).toMatchTextFile({
    fileExtension: "md",
  });
});
```

## Options

The `markdownTableSnapshot` function accepts an optional second parameter with the following options:

| Option              | Type      | Default | Description                                           |
| ------------------- | --------- | ------- | ----------------------------------------------------- |
| `showSortIndicator` | `boolean` | `false` | Display sort indicators next to sorted column headers |

### Sort Indicators

When `showSortIndicator` is enabled, column headers with `aria-sort` attributes will display:

- `⯅` for ascending sort
- `⯆` for descending sort
- `◆` for other sort types

## Examples

### HTML Table with Row Headers

```ts
test("employee table", async ({ page }) => {
  await page.setContent(`
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
      </tbody>
    </table>
  `);

  await expect(markdownTableSnapshot(page.getByRole("table"))).toMatchTextFile({
    fileExtension: "md",
  });
});
```

**Output:**

```md
| Employee      | Department  | Salary  |
| ------------- | ----------- | ------- |
| Alice Johnson | Engineering | $95,000 |
| Bob Smith     | Marketing   | $75,000 |
```

### ARIA Grid

```ts
test("product grid", async ({ page }) => {
  await page.setContent(`
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
  `);

  await expect(markdownTableSnapshot(page.getByRole("grid"))).toMatchTextFile({
    fileExtension: "md",
  });
});
```

**Output:**

```md
| Product | Price | Stock |
| ------- | ----- | ----- |
| Laptop  | $999  | 15    |
| Mouse   | $25   | 150   |
```

### Sorted Column Headers

```ts
test("sorted table", async ({ page }) => {
  await page.setContent(`
    <table>
      <thead>
        <tr>
          <th scope="col" aria-sort="descending">Name</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice</td>
          <td>95</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>88</td>
        </tr>
      </tbody>
    </table>
  `);

  await expect(markdownTableSnapshot(page.getByRole("table"))).toMatchTextFile({
    fileExtension: "md",
  });
});
```

**Output:**

```md
| Name ⯆ | Score |
| ------ | ----- |
| Alice  | 95    |
| Bob    | 88    |
```

## Supported Elements

The `markdownTableSnapshot` function works with:

- HTML `<table>` elements
- ARIA `grid` elements (with `role="grid"`)
- Any element with `role="table"`

It requires:

- At least one row with `role="row"`
- A header row containing `columnheader` elements
- Body rows containing `cell`, `gridcell`, or `rowheader` elements
