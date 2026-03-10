# Getting Started

## Installation

Add the library to your project using your preferred package manager:

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

## Define Custom Matchers

Define the Custom Matchers as a reusable export (e.g. in `fixtures.ts`):

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

export const expect = defineValidationFileExpect();
```

Then import your custom `expect` instead of Playwright's base `expect` in your tests:

```ts
import { test } from "@playwright/test";

import { expect } from "./fixtures";

test("matches JSON file", async () => {
  const snapshot = "…";
  await expect(snapshot).toMatchJsonFile();
});
```

If you are already using other custom matchers, you can merge them with the validation file matchers:

```ts
import { mergeExpects, mergeTests } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = mergeExpects(defineValidationFileExpect(), otherExpect);
```

## Configure `.gitignore`

All file snapshots are generated to `/data/test`. The golden masters will be stored in `/data/test/validation`, which should be under version control. The file snapshots generated for test runs will be stored under `/data/test/output` and should be ignored:

```
# file snapshots
/data/test/output
```
