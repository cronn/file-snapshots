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
- ARIA and element snapshots: Achieve high test coverage by snapshotting the semantical structure and accessible contents of a page

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

When creating missing file snapshots, instead of retrying a delay of 250 ms (or `timeout` when lower) is added before performing the snapshot. This avoids flaky snapshots and long-running tests.
The same behavior is used when updating snapshots.

The default delay can be overridden by defining `updateDelay` as matcher or file snapshot option.

### Using Soft Assertions

We recommend to use soft assertions for all file snapshot matchers. This prevents tests from terminating early when a file snapshot cannot be matched, making the process of reviewing failed test runs more efficient.

#### Enabling Soft Assertions for Individual Assertions

```ts
test("match values using soft assertions", async () => {
  await expect.soft({ value: "value 1" }).toMatchJsonFile();
  await expect.soft({ value: "value 2" }).toMatchJsonFile();
});
```

#### Enabling Soft Assertions for All Matchers

```ts
export const expect = defineValidationFileExpect().configure({
  soft: true,
});
```

> [!NOTE]
> Enabling soft assertions for all matchers may have unintended side effects if you are using matchers like `expect.toPass`.

## Snapshot Implementations

### [ARIA Snapshots](../aria-snapshot/README.md)

ARIA Snapshots are a JSON-based adapter for Playwright's YAML-based ARIA Snapshots. They facilitate snapshot composition using a format natively supported by JavaScript.

```ts
import { snapshotAria } from "@cronn/aria-snapshot";

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

### [Element Snapshots](../element-snapshot/README.md)

Element Snapshots are an alternative to ARIA Snapshots, providing a higher coverage of HTML and ARIA attributes as well as the ability to implement custom snapshots, e.g. for Markdown Tables.

```ts
import { snapshotElement } from "@cronn/element-snapshot";

test("matches element snapshot", async ({ page }) => {
  await expect(snapshotElement(page.getByRole("main"))).toMatchJsonFile();
});
```

Element Snapshot Example:

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

| Option            | Default Value          | Description                                                         |
| ----------------- | ---------------------- | ------------------------------------------------------------------- |
| `validationDir`   | `data/test/validation` | Directory in which golden masters are stored.                       |
| `outputDir`       | `data/test/output`     | Directory in which file snapshots from test runs are stored.        |
| `indentSize`      | `2`                    | Indentation size in spaces used for serializing snapshots.          |
| `resolveFileName` | `resolveNameAsFile`    | Custom resolver for the file path used to store snapshots.          |
| `updateDelay`     | `250`                  | Delay in ms before repeatable snapshots are created in update mode. |

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
| `updateDelay`     | `250`               | Delay in ms before repeatable snapshots are created in update mode.                                     |

#### JSON Snapshot Options

| Option                             | Default Value | Description                                                                 |
| ---------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted. |

#### Text Snapshot Options

| Option          | Default Value | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `fileExtension` | `txt`         | File extension used for storing the text file. |

## Updating Snapshots

Snapshots can be updated using Playwright's built-in support for snapshot updates:

- Using the CLI parameter `--update-snapshots [mode]`
- Configuring the Testing Option "Update snapshots" in the Playwright Test UI
- Configuring the option `updateSnapshots` in your `playwright.config.ts`

By default, only missing validation files are written. Using the values `all` or `changed`, existing validation files will also be overridden.

> [!NOTE]
> If you accidentally updated more snapshots than intended, you can revert the changes using your VCS and selectively apply updates by diffing the `validation` and `output` directories.
