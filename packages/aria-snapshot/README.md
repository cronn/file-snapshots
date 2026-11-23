# Playwright ARIA Snapshots

JSON-based ARIA snapshots for Playwright.

[Read the full documentation](https://cronn.github.io/file-snapshots/playwright/aria-snapshots)

[Playwright's ARIA Snapshots](https://playwright.dev/docs/aria-snapshots) capture the accessibility tree of a page as YAML. This package transforms them into a JSON format, which can be composed natively in JavaScript and stored as file snapshots using [`@cronn/playwright-file-snapshots`](https://www.npmjs.com/package/@cronn/playwright-file-snapshots).

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

### Configuration

Define a reusable `expect` export (e.g. in `fixtures.ts`):

```ts
import { defineAriaSnapshotMatchers } from "@cronn/aria-snapshot";

export const expect = defineAriaSnapshotMatchers();
```

The function accepts the same options as `defineFileSnapshotMatchers`. See [Configuration](https://cronn.github.io/file-snapshots/playwright/configuration).

## Writing Tests

```ts
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

  await expect(page.getByRole("main")).toMatchAriaSnapshotFile();
});
```

**Output (`matches_ARIA_snapshot.json`):**

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

### Snapshot Function

`ariaSnapshot` returns the snapshot instead of writing it to a file. Use it to compose snapshots with the matchers of `@cronn/playwright-file-snapshots`:

```ts
import { ariaSnapshot } from "@cronn/aria-snapshot";
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

const expect = defineFileSnapshotMatchers();

test("matches composed ARIA snapshots", async ({ page }) => {
  await page.setContent(`
    <nav>Sidenav</nav>
    <main>Content</main>
  `);

  await expect({
    nav: await ariaSnapshot(page.getByRole("navigation")),
    main: await ariaSnapshot(page.getByRole("main")),
  }).toMatchJsonFile();
});
```

For working with file snapshots, e.g. adding and updating validation files, see [`@cronn/playwright-file-snapshots`](https://www.npmjs.com/package/@cronn/playwright-file-snapshots).
