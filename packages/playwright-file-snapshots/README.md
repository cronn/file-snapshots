# Playwright File Snapshots

Write tests with Playwright using file snapshots.

[Read the full documentation](https://cronn.github.io/file-snapshots/playwright/)

## How It Works

File snapshot matchers serialize the actual value to a file and compare it with a stored file. Snapshots are stored in two directories:

- **`data/test/validation`** contains the expected snapshots (golden masters), which are under version control
- **`data/test/output`** contains the snapshots of the latest test run, which are ignored by version control

The file name of a snapshot is derived from the test file and the hierarchy of test titles, so no names have to be specified.

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
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

export const expect = defineFileSnapshotMatchers();
```

If you are already using other custom matchers, merge them using `mergeExpects`:

```ts
import { mergeExpects } from "@playwright/test";

import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

export const expect = mergeExpects(defineFileSnapshotMatchers(), otherExpect);
```

Add the output directory to your `.gitignore`:

```
# file snapshots
/data/test/output
```

## Writing Tests

Import your custom `expect` instead of Playwright's base `expect`:

```ts
import { test } from "@playwright/test";

import { expect } from "./fixtures";

test("value is expected value", async () => {
  await expect({ value: "expected value" }).toMatchJsonFile();
});
```

**Output (`value_is_expected_value.json`):**

```json
{
  "value": "expected value"
}
```

### File Matchers

- [`toMatchJsonFile`](https://cronn.github.io/file-snapshots/playwright/file-matchers/to-match-json-file) — serializes the value as a JSON file
- [`toMatchTextFile`](https://cronn.github.io/file-snapshots/playwright/file-matchers/to-match-text-file) — serializes the value as a plain text file

```ts
test("matches page title", async ({ page }) => {
  await page.setContent("<title>Page Title</title>");

  await expect(page.title()).toMatchTextFile();
});
```

**Output (`matches_page_title.txt`):**

```
Page Title
```

### Normalizers

Normalizers mask values which are not stable between test runs, e.g. timestamps or IDs:

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
```

**Output (`date_is_masked.json`):**

```json
{
  "date": "[DATE]"
}
```

Ready-to-use normalizers like `maskString` and `maskPattern` are exported by this package. See [Normalizers](https://cronn.github.io/file-snapshots/general/normalizers).

### Named Snapshots

When using multiple file snapshot matchers in the same test, give each snapshot a unique `name`:

```ts
test("named snapshots", async () => {
  // named_snapshots/snapshot_1.txt
  await expect("value 1").toMatchTextFile({ name: "snapshot 1" });
  // named_snapshots/snapshot_2.txt
  await expect("value 2").toMatchTextFile({ name: "snapshot 2" });
});
```

To customize how file paths are resolved, see [File Path Resolvers](https://cronn.github.io/file-snapshots/general/file-path-resolvers).

### Snapshot Retries

Pass a callback as actual value to retry the snapshot until it matches the validation file or the expect timeout is reached:

```ts
test("retry snapshot", async ({ page }) => {
  await expect(() => page.getByRole("main").textContent()).toMatchTextFile();
});
```

### Soft Assertions

Using soft assertions is recommended, so that a test reports all mismatching snapshots instead of failing at the first one:

```ts
test("match values using soft assertions", async () => {
  await expect.soft({ value: "value 1" }).toMatchJsonFile({ name: "first" });
  await expect.soft({ value: "value 2" }).toMatchJsonFile({ name: "second" });
});
```

## Working with File Snapshots

### Adding New Snapshots

When no validation file exists, the matcher fails and creates a new validation file starting with a marker line:

```
===== missing file =====
```

Review the file, remove the marker line and commit it.

### Updating Changed Snapshots

Each test run writes all snapshots to the output directory. To review changes, compare the `validation` and `output` directories using a directory diff tool and apply intended changes to the validation files.

Alternatively, use Playwright's built-in support for updating snapshots, e.g. `--update-snapshots changed`. By default, only missing validation files are written.

### Removing Unused Snapshots

Validation files of renamed or deleted tests are not removed automatically. Use [`@cronn/file-snapshots-cli`](https://www.npmjs.com/package/@cronn/file-snapshots-cli) to detect and delete them.

## Configuration

Options can be passed when defining the matchers:

```ts
export const expect = defineFileSnapshotMatchers({
  validationDir: "custom-data/validation",
  outputDir: "custom-data/output",
});
```

See [Configuration](https://cronn.github.io/file-snapshots/playwright/configuration) for all available options.

## Related Packages

- [`@cronn/element-snapshot`](https://www.npmjs.com/package/@cronn/element-snapshot) — snapshots of the semantic structure of a page
- [`@cronn/aria-snapshot`](https://www.npmjs.com/package/@cronn/aria-snapshot) — JSON-based ARIA snapshots
- [`@cronn/file-snapshots-cli`](https://www.npmjs.com/package/@cronn/file-snapshots-cli) — CLI for detecting unused file snapshots
