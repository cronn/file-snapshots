# playwright-file-snapshots

Write tests with Playwright using file snapshots.

## Motivation

Classical assertions in Playwright typically assert only specific aspects of a
page considered relevant for the current test. Complex assertions are usually
cumbersome to write and hard to maintain. Also, regressions caused by side
effects might be introduced unnoticed, because assertions focus only on what's
expected to change after a user interaction.

File snapshots can help to increase test coverage by enabling assertions which
cover larger portions of a tested page. `playwright-file-snapshots` provide
custom matchers for snapshot testing with the following features:

- Zero configuration: snapshot files are named based on the test name
- Multiple snapshot formats: JSON, text
- Snapshot retries: avoid flaky tests by retrying snapshots
- ARIA and DOM snapshots: Achieve high test coverage by snapshotting the semantical structure and accessible contents of a page

## Getting Started

### Adding the library to your project

```shell
npm install -D @cronn/playwright-file-snapshots
```

```shell
yarn add -D @cronn/playwright-file-snapshots
```

```shell
pnpm add -D @cronn/playwright-file-snapshots
```

### Using the Custom Matchers in your project

Define the Custom Matchers as a reusable export (e.g. in `fixtures.ts`):

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

export const expect = defineValidationFileExpect();
```

Then import your custom expect instead of Playwright's base `expect` in your
tests:

```ts
import { test } from "@playwright/test";

import { expect } from "./fixtures";

test("matches JSON file", async () => {
  const snapshot = "…";
  await expect(snapshot).toMatchJsonFile();
});
```

If you are already using other custom matchers, you can merge them with the
validation file matchers:

```ts
import { mergeExpects, mergeTests } from "@playwright/test";

import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = mergeExpects(defineValidationFileExpect(), otherExpect);
```

### Adding output files to `.gitignore`

All file snapshots are generated to `/data/test`. The golden masters will be
stored in `/data/test/validation`, which should be under version control. The
file snapshots generated for test runs will be stored under
`/data/test/output` and should be ignored:

```gitignore
# file snapshots
/data/test/output
```

## Writing Tests

File snapshot assertions use one of the custom matchers:

- `toMatchJsonFile`
- `toMatchTextFile`

### JSON File Snapshot

```ts
test("value is expected value", async () => {
  await expect({ value: "expected value" }).toMatchJsonFile();
});

// value_is_expected_value.json
// {
//   "value": "expected value"
// }
```

### Text File Snapshot

```ts
test("value is expected value", async () => {
  await expect("expected value").toMatchTextFile();
});

// value_is_expected_value.txt
// expected value
```

### Normalization of Snapshots

Normalizers can be used to apply custom normalization, e.g. mask values which
are not stable. Custom normalizers are applied before internal normalizers and
the snapshot serialization.

```ts
function maskDate(value: unknown): unknown {
  if (value instanceof Date) {
    return "[DATE]";
  }

  return value;
}

test("date is masked", async () => {
  await expect({ date: new Date() }).toMatchJsonFile({
    normalizers: [maskDate],
  });
});

// date_is_masked.json
// {
//   "date": "[DATE]"
// }
```

### Named Snapshots

By default, the name of a file snapshot is automatically derived from the hierarchy of test titles, including `test.describe`, `test` and `test.step`. When using multiple file snapshot matchers in the same test context, it's necessary to define a unique `name` for the snapshot.

```ts
test("named snapshots", async () => {
  // named_snapshots/snapshot_1.txt
  await expect("value 1").toMatchTextFile({ name: "snapshot 1" });
  // named_snapshots/snapshot_2.txt
  await expect("value 2").toMatchTextFile({ name: "snapshot 2" });
});
```

By default, all named snapshots are stored as separate files in the same directory, which is determined by the test context.

To change this behavior, you can use a different file path resolver:

```ts
import { resolveNameAsFileSuffix } from "@cronn/playwright-file-snapshots";

test("named snapshots", async () => {
  // named_snapshots_snapshot_name.txt
  await expect("value 1").toMatchTextFile({
    name: "snapshot name",
    resolveFilePath: resolveNameAsFileSuffix,
  });
});
```

### Snapshot Retries

All file snapshot assertions support retries, inspired by Playwright's existing retry mechanism. In order to enable snapshot retries, pass a callback as actual value:

```ts
test("retry snapshot", async ({ page }) => {
  await expect(() => page.getByRole("main").textContent()).toMatchTextFile();
});
```

By default, Playwright's Expect timeout (5 s) is used. To define a custom timeout, pass the `timeout` option to the matcher:

```ts
test("retry snapshot", async ({ page }) => {
  await expect(() => page.getByRole("main").textContent()).toMatchTextFile({
    timeout: 500,
  });
});
```

When creating missing file snapshots, instead of retrying a delay of 250 ms (or `timeout` when lower) is added before performing the snapshot. This avoids flaky snapshots and long running tests.

The same behavior can be enforced to update snapshots: simply pass the `--update-snapshots` flag to the Playwright CLI. Note that in contrast to Playwright, this only creates updated output files. The corresponding validation files need to be updated in a separate step.

### Using Soft Assertions

All file snapshot matchers use soft assertions by default. This allows to check
all snapshots within a test in single run:

```ts
test("perform login", async () => {
  await test.step("initial page", async () => {
    const snapshot = await myPage.snapshot();
    await expect(snapshot).toMatchJsonFile();
  });

  await test.step("login page", async () => {
    await myPage.login("user", "password");
    const snapshot = await myPage.snapshot();
    await expect(snapshot).toMatchJsonFile();
  });
});
```

## ARIA Snapshots

Playwright's [ARIA Snapshots](https://playwright.dev/docs/aria-snapshots)
provide a way to snapshot the accessibility tree of a page. Unfortunately, they
use YAML as serialization format, which makes it hard to programmatically
process ARIA snapshots in TypeScript, e.g. for combining ARIA snapshots of
multiple locators in a single snapshot.

For this reason, `playwright-file-snapshots` provides the custom wrapper
`snapshotAria` around Playwright's ARIA snapshot, which transforms the YAML
snapshot into a JSON-compatible snapshot ready to be passed to
`toMatchJsonFile`:

```ts
import { snapshotAria } from "@cronn/playwright-file-snapshots";

test("matches ARIA snapshot", async ({ page }) => {
  await expect(snapshotAria(page.getByRole("main"))).toMatchJsonFile();
});
```

To combine multiple ARIA snapshots in one JSON file, you can group them using an
object:

```ts
import { snapshotAria } from "@cronn/playwright-file-snapshots";

test("matches combined ARIA snapshots", async ({ page }) => {
  await expect({
    nav: await snapshotAria(page.getByRole("navigation")),
    main: await snapshotAria(page.getByRole("main")),
  }).toMatchJsonFile();
});
```

## DOM Snapshots (experimental)

DOM Snapshots are a custom snapshot implementation inspired by Playwright's ARIA Snapshots and the [Accessibility Object Model](https://wicg.github.io/aom/explainer.html). They cover additional properties, e.g. validation attributes like `required` or `invalid` on form inputs, and are optimized to be serialized as JSON.

```ts
import { snapshotDom } from "@cronn/playwright-file-snapshots";

test("matches DOM snapshot", async ({ page }) => {
  await expect(snapshotDom(page.getByRole("main"))).toMatchJsonFile();
});
```

Note that DOM Snapshots are currently an experimental feature. Not all elements and roles are covered, and the serialization format might change.

### DOM Snapshot Options

Snapshot options can be passed when calling the snapshot function:

```ts
await expect(
  snapshotDom(page.getByLabel("My select"), { includeComboboxOptions: true }),
).toMatchJsonFile({
  name: "select options",
});
```

| Option                   | Default Value | Description                               |
| ------------------------ | ------------- | ----------------------------------------- |
| `includeComboboxOptions` | `false`       | Include combobox options in the snapshot. |

## Configuration

### Matcher Options

Matcher options can be passed when defining the matcher:

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect({
  validationDir: "custom-validation",
  outputDir: "custom-output",
});
```

| Option            | Default Value          | Description                                                  |
| ----------------- | ---------------------- | ------------------------------------------------------------ |
| `validationDir`   | `data/test/validation` | Directory in which golden masters are stored.                |
| `outputDir`       | `data/test/output`     | Directory in which file snapshots from test runs are stored. |
| `soft`            | `true`                 | Enable soft assertions.                                      |
| `indentSize`      | `2`                    | Indentation size in spaces used for serializing snapshots.   |
| `resolveFileName` | `resolveNameAsFile`    | Custom resolver for the file path used to store snapshots.   |

### File Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

```ts
await expect(value).toMatchTextFile({
  name: "snapshot",
});
```

| Option            | Default Value       | Description                                                                                             |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| `name`            | `undefined`         | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. |
| `normalizers`     | `[]`                | Custom normalizers to apply before serialization.                                                       |
| `timeout`         | expect timeout      | Retries the snapshot until it passes or the timeout value is reached.                                   |
| `resolveFileName` | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                              |

#### JSON Snapshot Options

| Option                             | Default Value | Description                                                                 |
| ---------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted. |
