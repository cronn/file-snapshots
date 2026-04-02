# Playwright File Snapshots

Write tests with Playwright using file snapshots.

## Motivation

Classical assertions in Playwright typically assert only specific aspects of a page considered relevant for the current test. Complex assertions are usually cumbersome to write and hard to maintain. Also, regressions caused by side effects might be introduced unnoticed, because assertions focus only on what's expected to change after a user interaction.

File snapshots can help to increase test coverage by enabling assertions which cover larger portions of a tested page. `playwright-file-snapshots` provide custom matchers for snapshot testing with the following features:

- Zero configuration: snapshot files are named based on the test name
- Multiple snapshot formats: JSON, text
- Snapshot retries: avoid flaky tests by retrying snapshots
- ARIA and element snapshots: Achieve high test coverage by snapshotting the semantical structure and accessible contents of a page

## Quick Start

Install the package:

::: code-group

```shell [pnpm]
pnpm add -D @cronn/playwright-file-snapshots
```

```shell [npm]
npm install -D @cronn/playwright-file-snapshots
```

```shell [yarn]
yarn add -D @cronn/playwright-file-snapshots
```

:::

Define the custom matchers (e.g. in `fixtures.ts`):

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

export const expect = defineValidationFileExpect();
```

Start writing tests:

```ts
import { test } from "@playwright/test";

import { expect } from "./fixtures";

test("matches JSON file", async () => {
  await expect({ value: "expected value" }).toMatchJsonFile();
});
```

**Output (`matches_JSON_file.json`):**

```json
{
  "value": "expected value"
}
```

## Snapshot Implementations

### ARIA Snapshots

ARIA Snapshots are a JSON-based adapter for Playwright's YAML-based ARIA Snapshots. They facilitate snapshot composition using a format natively supported by JavaScript.

```ts
import { snapshotAria } from "@cronn/aria-snapshot";

test("matches ARIA snapshot", async ({ page }) => {
  await expect(snapshotAria(page.getByRole("main"))).toMatchJsonFile();
});
```

**Output (`matches_aria_snapshot.json`):**

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

[Learn more about ARIA Snapshots →](/playwright/aria-snapshots)

### Element Snapshots

Element Snapshots are an alternative to ARIA Snapshots, providing a higher coverage of HTML and ARIA attributes as well as the ability to implement custom snapshots, e.g. for Markdown Tables.

```ts
import { snapshotElement } from "@cronn/element-snapshot";

test("matches element snapshot", async ({ page }) => {
  await expect(snapshotElement(page.getByRole("main"))).toMatchJsonFile();
});
```

**Output (`̀matches_element_snapshot.json`):**

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

[Learn more about Element Snapshots →](/playwright/element-snapshots/)

## Next Steps

- [Getting Started](/playwright/getting-started) - Full setup instructions
- [Writing Tests](/playwright/writing-tests) - Learn how to write file snapshot tests
- [Configuration](/playwright/configuration) - Configure matcher and snapshot options
