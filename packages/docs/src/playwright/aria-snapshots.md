# ARIA Snapshots

[Playwright's ARIA Snapshots](https://playwright.dev/docs/aria-snapshots) snapshot the accessibility tree of a page using YAML as serialization format. `@cronn/aria-snapshot` provides a lightweight adapter, transforming the original YAML format to an optimized JSON format.

Serializing ARIA Snapshots in JSON provides more flexibility when writing Playwright tests, because JSON structures are natively supported in JavaScript and can be composed without requiring additional tooling.

## Getting Started

### Adding the library to your project

::: code-group

```shell [pnpm]
pnpm add -D @cronn/aria-snapshot
```

```shell [npm]
npm install -D @cronn/aria-snapshot
```

```shell [yarn]
yarn add -D @cronn/aria-snapshot
```

:::

## Define Custom Matchers

Define the Custom Matchers as a reusable export (e.g. in `fixtures.ts`):

```ts
import { defineAriaSnapshotMatchers } from "@cronn/aria-snapshot";

export const expect = defineAriaSnapshotMatchers();
```

The function takes the same options as `defineFileSnapshotMatchers`. See [Configuration](/playwright/configuration) for a list of available configuration options.

## Writing Tests

```ts
import { defineAriaSnapshotMatchers } from "@cronn/aria-snapshot";

const expect = defineAriaSnapshotMatchers();

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

**Output (`̀matches_ARIA_snapshot.json`):**

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

The `ariaSnapshot` function provides more flexibility than the `toMatchAriaSnapshotFile` matcher, because it returns the snapshot result as a JavaScript object instead of directly writing it to a file. This makes it suitable for composing custom assertions:

```ts
import { ariaSnapshot } from "@cronn/aria-snapshot";
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-matchers";

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
