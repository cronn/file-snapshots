# Vitest File Snapshots

Write tests with Vitest using file snapshots.

[Read the full documentation](https://cronn.github.io/file-snapshots/vitest/)

## How It Works

File snapshot matchers serialize the actual value to a file and compare it with a stored file. Snapshots are stored in two directories:

- **`data/test/validation`** contains the expected snapshots (golden masters), which are under version control
- **`data/test/output`** contains the snapshots of the latest test run, which are ignored by version control

The file name of a snapshot is derived from the test file and the hierarchy of test titles, so no names have to be specified.

## Getting Started

### Installation

```shell
pnpm add -D @cronn/vitest-file-snapshots
```

```shell
npm install -D @cronn/vitest-file-snapshots
```

```shell
yarn add -D @cronn/vitest-file-snapshots
```

### Configuration

Register the custom matchers in your `vitest-setup.ts`:

```ts
import { registerFileSnapshotMatchers } from "@cronn/vitest-file-snapshots/register";

registerFileSnapshotMatchers();
```

Add the setup file to your `vitest.config.ts`:

```ts
{
  test: {
    setupFiles: ["vitest-setup.ts"];
  }
}
```

Add the setup file to your `tsconfig.json`:

```json
{
  "include": ["vitest-setup.ts"]
}
```

Add the output directory to your `.gitignore`:

```
# file snapshots
/data/test/output
```

## Writing Tests

```ts
test("value is expected value", () => {
  expect({ value: "expected value" }).toMatchJsonFile();
});
```

**Output (`value_is_expected_value.json`):**

```json
{
  "value": "expected value"
}
```

### File Matchers

- [`toMatchJsonFile`](https://cronn.github.io/file-snapshots/vitest/file-matchers/to-match-json-file) — serializes the value as a JSON file
- [`toMatchTextFile`](https://cronn.github.io/file-snapshots/vitest/file-matchers/to-match-text-file) — serializes the value as a plain text file
- [`toMatchMarkdownTableFile`](https://cronn.github.io/file-snapshots/vitest/file-matchers/to-match-markdown-table-file) — serializes tabular data as a Markdown table file

```ts
import { Table } from "@cronn/vitest-file-snapshots";

test("matches Markdown table", () => {
  expect(
    Table.fromRecords([
      { input: "input 1", output: "output 1" },
      { input: "input 2", output: "output 2" },
    ]),
  ).toMatchMarkdownTableFile();
});
```

**Output (`matches_Markdown_table.md`):**

```md
| input   | output   |
| ------- | -------- |
| input 1 | output 1 |
| input 2 | output 2 |
```

### Normalizers

Normalizers mask values which are not stable between test runs, e.g. timestamps or IDs:

```ts
function maskDate(value: unknown): unknown {
  if (value instanceof Date) {
    return "<DATE>";
  }

  return value;
}

test("date is masked", () => {
  expect({ date: new Date() }).toMatchJsonFile({ normalizers: [maskDate] });
});
```

**Output (`date_is_masked.json`):**

```json
{
  "date": "<DATE>"
}
```

Ready-to-use normalizers like `maskString` and `maskPattern` are exported by this package. See [Normalizers](https://cronn.github.io/file-snapshots/general/normalizers).

### Named Snapshots

When using multiple file snapshot matchers in the same test, give each snapshot a unique `name`:

```ts
test("named snapshots", () => {
  // named_snapshots/snapshot_1.txt
  expect("value 1").toMatchTextFile({ name: "snapshot 1" });
  // named_snapshots/snapshot_2.txt
  expect("value 2").toMatchTextFile({ name: "snapshot 2" });
});
```

To customize how file paths are resolved, see [File Path Resolvers](https://cronn.github.io/file-snapshots/general/file-path-resolvers).

### Soft Assertions

Use `expect.soft` to report all mismatching snapshots of a test instead of failing at the first one:

```ts
test("value is mapped", () => {
  expect.soft({ value: "value" }).toMatchJsonFile({ name: "before" });
  expect.soft({ value: "mapped value" }).toMatchJsonFile({ name: "after" });
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

Alternatively, use Vitest's built-in support for updating snapshots, e.g. `vitest --update`. By default, only missing validation files are written.

### Removing Unused Snapshots

Validation files of renamed or deleted tests are not removed automatically. Use [`@cronn/file-snapshots-cli`](https://www.npmjs.com/package/@cronn/file-snapshots-cli) to detect and delete them.

## Configuration

Options can be passed when registering the matchers:

```ts
registerFileSnapshotMatchers({
  testDir: "src",
});
```

See [Configuration](https://cronn.github.io/file-snapshots/vitest/configuration) for all available options.

## Related Packages

- [`@cronn/file-snapshots-cli`](https://www.npmjs.com/package/@cronn/file-snapshots-cli) — CLI for detecting unused file snapshots
