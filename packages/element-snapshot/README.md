# Playwright Element Snapshots

Element snapshots for Playwright.

[Read the full documentation](https://cronn.github.io/file-snapshots/playwright/element-snapshots/)

> [!NOTE]
> Element Snapshots are currently experimental. Not all HTML elements, ARIA roles and attributes are covered. Breaking changes to the snapshot format are possible.

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

## Writing Tests

```ts
import { semanticSnapshot } from "@cronn/element-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("matches element snapshot", async ({ page }) => {
  await page.setContent(`
    <main>
      <h1>List</h1>
      <ul>
        <li>Apple</li>
        <li>Peach</li>
      </ul>
    </main>
  `);

  await expect(semanticSnapshot(page.getByRole("main"))).toMatchJsonFile();
});
```

**Output (`matches_element_snapshot.json`):**

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
