# Playwright ARIA Snapshots

JSON-based ARIA snapshots for Playwright.

[Read the full documentation](https://cronn.github.io/file-snapshots/playwright/aria-snapshots)

## Getting Started

### Installation

```shell
pnpm add -D @cronn/aria-snapshot
```

```shell
npm install -D @cronn/aria-snapshot
```

```shell
yarn add -D @cronn/aria-snapshot
```

## Writing Tests

```ts
import { snapshotAria } from "@cronn/aria-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("matches ARIA snapshot", async ({ page }) => {
  await page.setContent(`
    <main>
      <h1>List</h1>
      <ul>
        <li>Apple</li>
        <li>Peach</li>
      </ul>
    </main>
  `);

  await expect(snapshotAria(page.getByRole("main"))).toMatchJsonFile();
});
```

**_matches_aria_snapshot.json_**

```json
{
  "main": [
    "heading 'List' [level=1]",
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
