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

```ts [fixtures.ts]
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

export const expect = defineFileSnapshotMatchers();
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

```ts [fixtures.ts]
import { mergeExpects } from "@playwright/test";
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

const expect = mergeExpects(defineFileSnapshotMatchers(), otherExpect);
```

> [!TIP]
> When using other custom matchers which are based on `@cronn/playwright-file-snapshots` (e.g. [`@cronn/element-snapshot`](/playwright/element-snapshots/)), you can use the `defineConfig` helper to define a shared configuration:
>
> ```ts [fixtures.ts]
> import { mergeExpects } from "@playwright/test";
>
> import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";
> import { defineElementSnapshotMatchers } from "@cronn/element-snapshot";
>
> const config = definedConfig({
>   updateDelay: 1000,
> });
>
> const expect = mergeExpects(
>   defineFileSnapshotMatchers(config),
>   defineElementSnapshotMatchers(config),
> );
> ```

## Configure `.gitignore`

All file snapshots are generated to `/data/test`. The golden masters will be stored in `/data/test/validation`, which should be under version control. The file snapshots generated for test runs will be stored under `/data/test/output` and should be ignored:

```[.gitignore]
# file snapshots
/data/test/output
```
