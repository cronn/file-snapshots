# Element Snapshot

Element Snapshots are a custom snapshot implementation inspired by [Playwright's ARIA Snapshots](https://playwright.dev/docs/aria-snapshots#aria-snapshots) and the [Accessibility Object Model](https://wicg.github.io/aom/explainer.html). They cover additional properties, e.g. validation attributes like `required` or `invalid` on form inputs, and are optimized to be serialized as JSON.

Element Snapshots are designed to be used in combination with [playwright-file-snapshots](../playwright-file-snapshots/README.md) for writing Playwright tests.

> [!NOTE]
> Element Snapshots are currently experimental. Not all HTML elements, ARIA roles and attributes are covered. Breaking changes to the snapshot format are possible.

## Getting Started

### Adding the library to your project

```shell
npm install -D @cronn/element-snapshot
```

```shell
yarn add -D @cronn/element-snapshot
```

```shell
pnpm add -D @cronn/element-snapshot
```

## Writing Tests

### General-Purpose Snapshots

The function `snapshotElement` provides a general-purpose snapshot including all supported roles and attributes. It can be used to achieve a high test coverage, but can become hard to read for complex HTML structures.

```ts
import { snapshotElement } from "@cronn/element-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("matches element snapshot", async ({ page }) => {
  await expect(snapshotElement(page.getByRole("main"))).toMatchJsonFile();
});
```

Element Snapshot Example:

```json
{
  "main": [
    {
      "heading": {
        "name": "List",
        "level": 1
      }
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

To improve the specificity of certain tests, `snapshotElement` can be called on certain areas of the page only:

```ts
test("matches navigation snapshot", async ({ page }) => {
  await expect(snapshotElement(page.getByRole("navigation"))).toMatchJsonFile({
    name: "navigation",
  });
});
```

#### Snapshot Options

Snapshot options can be passed when calling the snapshot function:

```ts
await expect(
  snapshotElement(page.getByLabel("My select"), {
    includeComboboxOptions: true,
  }),
).toMatchJsonFile({
  name: "select options",
});
```

### Custom Snapshots

The function `snapshotElementRaw` provides the raw element snapshot in a strictly typed structure. This format is not well suited to be read by humans, but can be utilized to derive custom snapshot formats, e.g. for HTML tables.

```ts
import { snapshotElementRaw } from "@cronn/element-snapshot";

test("matches custom snapshot", async ({ page }) => {
  const tableSnapshot = await snapshotElementRaw(page.getByRole("table"));
  const markdownTable = transformToMarkdownTable(tableSnapshot);

  await expect(markdownTable).toMatchTextFile({ fileExtension: "md" });
});

function transformToMarkdownTable(snapshot: Array<NodeSnapshot>): string {
  // transform table snapshot to markdown table
}
```
