# ARIA Snapshots

[Playwright's ARIA Snapshots](https://playwright.dev/docs/aria-snapshots)
snapshot the accessibility tree of a page using YAML as serialization format. `@cronn/aria-snapshot` provides a lightweight adapter, transforming the original YAML format to an optimized JSON format.

Serializing ARIA Snapshots in JSON provides more flexibility when writing Playwright tests, because JSON structures are natively supported in JavaScript and can be composed without requiring additional tooling.

## Getting Started

### Adding the library to your project

```shell
npm install -D @cronn/aria-snapshot
```

```shell
yarn add -D @cronn/aria-snapshot
```

```shell
pnpm add -D @cronn/aria-snapshot
```

## Writing Tests

```ts
import { snapshotAria } from "@cronn/aria-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("matches ARIA snapshot", async ({ page }) => {
  await expect(snapshotAria(page.getByRole("main"))).toMatchJsonFile();
});
```

ARIA Snapshot Example:

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

To compose multiple ARIA snapshots in a single JSON file, you can use an object structure:

```ts
import { snapshotAria } from "@cronn/aria-snapshot";

test("matches composed ARIA snapshots", async ({ page }) => {
  await expect({
    nav: await snapshotAria(page.getByRole("navigation")),
    main: await snapshotAria(page.getByRole("main")),
  }).toMatchJsonFile();
});
```
