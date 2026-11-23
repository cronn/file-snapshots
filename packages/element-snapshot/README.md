# Playwright Element Snapshots

Element snapshots for Playwright.

[Read the full documentation](https://cronn.github.io/file-snapshots/playwright/element-snapshots/)

> [!NOTE]
> Element Snapshots are currently experimental. Not all HTML elements, ARIA roles and attributes are covered. Breaking changes to the snapshot format are possible.

Element Snapshots capture the semantic structure and accessible contents of a page, inspired by [Playwright's ARIA Snapshots](https://playwright.dev/docs/aria-snapshots). They cover additional properties like validation attributes of form inputs and are optimized for JSON serialization. They are stored as file snapshots using [`@cronn/playwright-file-snapshots`](https://www.npmjs.com/package/@cronn/playwright-file-snapshots).

## Getting Started

### Installation

```shell
pnpm add -D @cronn/element-snapshot
```

```shell
npm install -D @cronn/element-snapshot
```

```shell
yarn add -D @cronn/element-snapshot
```

### Configuration

Define a reusable `expect` export (e.g. in `fixtures.ts`):

```ts
import { defineElementSnapshotMatchers } from "@cronn/element-snapshot";

export const expect = defineElementSnapshotMatchers();
```

The function accepts the same options as `defineFileSnapshotMatchers`. To combine both, define a shared configuration using `defineConfig`:

```ts
import { mergeExpects } from "@playwright/test";

import { defineElementSnapshotMatchers } from "@cronn/element-snapshot";
import {
  defineConfig,
  defineFileSnapshotMatchers,
} from "@cronn/playwright-file-snapshots";

const config = defineConfig({
  validationDir: "custom-data/validation",
  outputDir: "custom-data/output",
});

export const expect = mergeExpects(
  defineFileSnapshotMatchers(config),
  defineElementSnapshotMatchers(config),
);
```

## Writing Tests

### Semantic Snapshots

`toMatchSemanticSnapshotFile` snapshots the semantic structure of an element, including all supported roles and attributes:

```ts
test("matches semantic snapshot", async ({ page }) => {
  await page.setContent(`
    <main>
      <h1>List</h1>
      <ul>
        <li>Apple</li>
        <li>Peach</li>
      </ul>
    </main>
  `);

  await expect(page.getByRole("main")).toMatchSemanticSnapshotFile();
});
```

**Output (`matches_semantic_snapshot.json`):**

```json
{
  "main": [
    {
      "heading": "List",
      "level": 1
    },
    {
      "list": [
        {
          "listitem": "Apple"
        },
        {
          "listitem": "Peach"
        }
      ]
    }
  ]
}
```

Snapshots can be narrowed down using a `filter` and customized per role using `transformers`. See [Semantic Snapshots](https://cronn.github.io/file-snapshots/playwright/element-snapshots/semantic-snapshots).

### Markdown Table Snapshots

`toMatchMarkdownTableSnapshotFile` snapshots an HTML `<table>` or ARIA `grid` as a Markdown table:

```ts
test("matches table snapshot", async ({ page }) => {
  await page.setContent(`
    <table>
      <thead>
        <tr><th>Product</th><th>Price</th></tr>
      </thead>
      <tbody>
        <tr><td>Laptop</td><td>$999</td></tr>
        <tr><td>Mouse</td><td>$25</td></tr>
      </tbody>
    </table>
  `);

  await expect(page.getByRole("table")).toMatchMarkdownTableSnapshotFile();
});
```

**Output (`matches_table_snapshot.md`):**

```md
| Product | Price |
| ------- | ----- |
| Laptop  | $999  |
| Mouse   | $25   |
```

See [Markdown Table Snapshot](https://cronn.github.io/file-snapshots/playwright/element-snapshots/markdown-table-snapshot).

### Snapshot Functions

`semanticSnapshot` and `markdownTableSnapshot` return the snapshot instead of writing it to a file. Use them to compose snapshots with the matchers of `@cronn/playwright-file-snapshots`:

```ts
import { semanticSnapshot } from "@cronn/element-snapshot";

test("matches composed snapshot", async ({ page }) => {
  await expect({
    navigation: await semanticSnapshot(page.getByRole("navigation")),
    main: await semanticSnapshot(page.getByRole("main")),
  }).toMatchJsonFile();
});
```

For working with file snapshots, e.g. adding and updating validation files, see [`@cronn/playwright-file-snapshots`](https://www.npmjs.com/package/@cronn/playwright-file-snapshots).
