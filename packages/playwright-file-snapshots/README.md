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
- Automatic serialization of native JS values like `undefined`, `Number.NaN` or
  `Date` objects in JSON

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

test("matches JSON file", () => {
  const snapshot = "…";
  expect(snapshot).toMatchJsonFile();
});
```

If you are already using other custom matchers, you can merge them with the
validation file matchers:

```ts
import { mergeTests, mergeExpects } from "@playwright/test";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = mergeExpects(
  defineValidationFileExpect(),
  otherExpect,
);
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
test("value is expected value", () => {
  expect({ value: "expected value" }).toMatchJsonFile();
});

// value_is_expected_value.json
// {
//   "value": "expected value"
// }
```

### Text File Snapshot

```ts
test("value is expected value", () => {
  expect("expected value").toMatchTextFile();
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

test("date is masked", () => {
  expect({ date: new Date() }).toMatchJsonFile({ normalizers: [maskDate] });
});

// date_is_masked.json
// {
//   "date": "[DATE]"
// }
```

### Using Soft Assertions

All file snapshot matchers use soft assertions by default. This allows to check
all snapshots within a test in single run:

```ts
test("perform login", async () => {
  await test.step("initial page", async () => {
    const snapshot = await myPage.snapshot();
    expect(snapshot).toMatchJsonFile();
  });

  await test.step("login page", async () => {
    await myPage.login("user", "password");
    const snapshot = await myPage.snapshot();
    expect(snapshot).toMatchJsonFile();
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

test("matches ARIA snapshots", async ({ page }) => {
  const ariaSnapshot = await snapshotAria(page.getByRole("main"));
  expect(ariaSnapshot).toMatchJsonFile();
});
```

To combine multiple ARIA snapshots in one JSON file, you can group them using an
object:

```ts
import { snapshotAria } from "@cronn/playwright-file-snapshots";

test("matches combined ARIA snapshots", async ({ page }) => {
  expect({
    nav: await snapshotAria(page.getByRole("navigation")),
    main: await snapshotAria(page.getByRole("main"))
  }).toMatchJsonFile();
});
```

## Configuration

### Matcher Options

Matcher options can be passed when defining the matcher:

 ```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect({
  validationDir: "custom-validation",
  outputDir: "custom-output"
});
```

| Option          | Default Value          | Description                                                           |
|-----------------|------------------------|-----------------------------------------------------------------------|
| `validationDir` | `data/test/validation` | Directory in which golden masters are stored.                         |
| `outputDir`     | `data/test/output`     | Directory in which file snapshots from test runs are stored.          |
| `filterSteps`   | `() => true`           | Filter test steps which should not be part of the snapshot file path. |

### File Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

 ```ts
expect(value).toMatchTextFile({
  name: "snapshot"
});
```

| Option        | Default Value | Description                                                                                             |
|---------------|---------------|---------------------------------------------------------------------------------------------------------|
| `name`        | `undefined`   | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. |
| `normalizers` | `[]`          | Custom normalizers to apply before serialization.                                                       |

#### JSON Snapshot Options

| Option                             | Default Value | Description                                                                 |
|------------------------------------|---------------|-----------------------------------------------------------------------------|
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted. |
