# Playwright File Snapshots

Write tests with Playwright using file snapshots.

[Read the full documentation](https://cronn.github.io/file-snapshots/playwright/)

## Getting Started

### Installation

```shell
pnpm add -D @cronn/playwright-file-snapshots
```

```shell
npm install -D @cronn/playwright-file-snapshots
```

```shell
yarn add -D @cronn/playwright-file-snapshots
```

### Configuration

Define a reusable `expect` export (e.g. in `fixtures.ts`):

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

export const expect = defineValidationFileExpect();
```

Add the output directory to your `.gitignore`:

```
# file snapshots
/data/test/output
```

## Writing Tests

```ts
import { test } from "@playwright/test";

import { expect } from "./fixtures";

test("value is expected value", async () => {
  await expect({ value: "expected value" }).toMatchJsonFile();
});
```

**_value_is_expected_value.json_**

```json
{
  "value": "expected value"
}
```
