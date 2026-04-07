# Writing Tests

## File Matchers

Each file matcher targets a specific snapshot format:

- [`toMatchJsonFile`](/vitest/file-matchers/to-match-json-file) — serializes the value as a JSON file
- [`toMatchTextFile`](/vitest/file-matchers/to-match-text-file) — serializes the value as a plain text file

**Example:**

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

## Multiple Expectations

You can test multiple related values in a single test:

```ts
function mapToString(value: boolean | number): string {
  return value.toString();
}

test("maps values to string", () => {
  expect({
    boolean: mapToString(true),
    positiveNumber: mapToString(1),
    negativeNumber: mapToString(-1),
  }).toMatchJsonFile();
});
```

**Output (`maps_values_to_string.json`):**

```json
{
  "boolean": "true",
  "positiveNumber": "1",
  "negativeNumber": "-1"
}
```

## Normalization of Snapshots

Normalizers can be used to apply custom normalization, e.g., mask values which are not stable. Custom normalizers are applied before internal normalizers and the snapshot serialization.

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
```

**Output (`date_is_masked.json`):**

```json
{
  "date": "[DATE]"
}
```

## Named Snapshots

By default, the name of a file snapshot is automatically derived from the hierarchy of test titles, including `describe` and `test`. When using multiple file snapshot matchers in the same test context, it's necessary to define a unique `name` for the snapshot.

```ts
test("named snapshots", () => {
  // named_snapshots/snapshot_1.txt
  expect("value 1").toMatchTextFile({ name: "snapshot 1" });
  // named_snapshots/snapshot_2.txt
  expect("value 2").toMatchTextFile({ name: "snapshot 2" });
});
```

By default, all named snapshots are stored as separate files in the same directory, which is determined by the test context.

### Custom File Path Resolver

To change the default behavior, you can use a different file path resolver:

```ts
import { resolveNameAsFileSuffix } from "@cronn/vitest-file-snapshots";

test("named snapshots", async () => {
  // named_snapshots_snapshot_name.txt
  await expect("value 1").toMatchTextFile({
    name: "snapshot name",
    resolveFilePath: resolveNameAsFileSuffix,
  });
});
```

## Soft Assertions

```ts
function mapValue(value: string): string {
  return `mapped ${value}`;
}

test("value is mapped", () => {
  const data = { value: "value" };
  expect.soft(initialValue).toMatchJsonFile({ name: "before" });
  expect.soft(mapValue(initialValue)).toMatchJsonFile({ name: "after" });
});
```

**Output 1 (`value_is_mapped_before.json`):**

```json
{
  "value": "value"
}
```

**Output 2 (`value_is_mapped_after.json`):**

```json
{
  "value": "mapped value"
}
```

## Updating Snapshots

Snapshots can be updated using Vitest's built-in support for snapshot updates:

- Using the CLI parameter `--update`
- Configuring the option `update` in your `vitest.config.ts`

By default, only missing validation files are written. When updates are enabled, existing validation files will also be overridden.

::: tip
If you accidentally updated more snapshots than intended, you can revert the changes using your VCS and selectively apply updates by diffing the `validation` and `output` directories.
:::
