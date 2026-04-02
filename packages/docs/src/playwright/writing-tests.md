# Writing Tests

File snapshot assertions use one of the custom matchers:

- `toMatchJsonFile`
- `toMatchTextFile`

## JSON File Snapshot

```ts
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

## Text File Snapshot

```ts
test("value is expected value", async () => {
  await expect("expected value").toMatchTextFile();
});
```

**Output (`value_is_expected_value.txt`):**

```
expected value
```

## Normalization of Snapshots

Normalizers can be used to apply custom normalization, e.g. mask values which are not stable. Custom normalizers are applied before internal normalizers and the snapshot serialization.

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

**Output (`value_is_expected_value.json`):**

```json
{
  "date": "[DATE]"
}
```

## Named Snapshots

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

## Snapshot Retries

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

When creating missing file snapshots, instead of retrying a delay of 250 ms (or `timeout` when lower) is added before performing the snapshot. This avoids flaky snapshots and long-running tests. The same behavior is used when updating snapshots.

The default delay can be overridden by defining `updateDelay` as matcher or file snapshot option.

## Using Soft Assertions

We recommend to use soft assertions for all file snapshot matchers. This prevents tests from terminating early when a file snapshot cannot be matched, making the process of reviewing failed test runs more efficient.

### Enabling Soft Assertions for Individual Assertions

```ts
test("match values using soft assertions", async () => {
  await expect.soft({ value: "value 1" }).toMatchJsonFile();
  await expect.soft({ value: "value 2" }).toMatchJsonFile();
});
```

### Enabling Soft Assertions for All Matchers

```ts
export const expect = defineValidationFileExpect().configure({
  soft: true,
});
```

::: warning
Enabling soft assertions for all matchers may have unintended side effects if you are using matchers like `expect.toPass`.
:::

## Updating Snapshots

Snapshots can be updated using Playwright's built-in support for snapshot updates:

- Using the CLI parameter `--update-snapshots [mode]`
- Configuring the Testing Option "Update snapshots" in the Playwright Test UI
- Configuring the option `updateSnapshots` in your `playwright.config.ts`

By default, only missing validation files are written. Using the values `all` or `changed`, existing validation files will also be overridden.

::: tip
If you accidentally updated more snapshots than intended, you can revert the changes using your VCS and selectively apply updates by diffing the `validation` and `output` directories.
:::
