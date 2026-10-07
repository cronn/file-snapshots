# File Path Resolvers

A file path resolver determines where a file snapshot is stored. The resolved path is used for both the validation file and the output file, so both directories always share the same structure.

The `resolveFilePath` option can be used to override the default file path, e.g. to stay compatible with existing validation files from other or older snapshot libraries, or to use a custom directory layout.

File path resolvers are defined in the `@cronn/lib-file-snapshots` package. For convenience, they are also re-exported from the [`@cronn/playwright-file-snapshots`](/playwright/) and [`@cronn/vitest-file-snapshots`](/vitest/) packages.

## How File Paths are Resolved

A file path resolver is a function which receives information about the current test and returns a file path:

```ts
type FilePathResolver = (params: FilePathResolverParams) => string;

interface FilePathResolverParams {
  testPath: string;
  titlePath: Array<string>;
  name?: string;
}
```

| Parameter   | Description                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `testPath`  | Path of the test file without the `.test` / `.spec` extension.                                                                                |
| `titlePath` | Hierarchy of test titles, e.g. `describe` and `test` (and `test.step` in Playwright). The titles are passed as-is and are **not** normalized. |
| `name`      | Value of the `name` option passed to the matcher, if any. Not normalized either.                                                              |

The returned path must be **relative** and must **not include a file extension**. It is resolved against `validationDir` and `outputDir`, and the file extension of the matcher is appended.

**Example:**

```ts [checkout.test.ts]
describe("Checkout", () => {
  test("applies discount: 10%", async () => {
    await expect(order).toMatchJsonFile({ name: "order summary" });
  });
});
```

The resolver receives the following parameters:

```ts
{
  testPath: "checkout",
  titlePath: ["Checkout", "applies discount: 10%"],
  name: "order summary",
}
```

With the default resolver, the resulting path is `checkout/Checkout/applies_discount_10/order_summary`, which leads to the following files:

```
data/test/validation/checkout/Checkout/applies_discount_10/order_summary.json
data/test/output/checkout/Checkout/applies_discount_10/order_summary.json
```

## Configuring a File Path Resolver

A file path resolver can be configured globally for all matchers or locally for a single matcher. A local resolver takes precedence over a global one. When no resolver is configured, `resolveNameAsFile` is used.

::: code-group

```ts [Playwright]
import {
  defineFileSnapshotMatchers,
  resolveNameAsFileSuffix,
} from "@cronn/playwright-file-snapshots";

// global
const expect = defineFileSnapshotMatchers({
  resolveFilePath: resolveNameAsFileSuffix,
});

// local
await expect(value).toMatchJsonFile({
  name: "snapshot name",
  resolveFilePath: resolveNameAsFileSuffix,
});
```

```ts [Vitest]
import { resolveNameAsFileSuffix } from "@cronn/vitest-file-snapshots";
import { registerFileSnapshotMatchers } from "@cronn/vitest-file-snapshots/register";

// global
registerFileSnapshotMatchers({
  resolveFilePath: resolveNameAsFileSuffix,
});

// local
expect(value).toMatchJsonFile({
  name: "snapshot name",
  resolveFilePath: resolveNameAsFileSuffix,
});
```

:::

## Built-in File Path Resolvers

Both built-in resolvers normalize every title and the `name` using [`normalizeFileName`](#normalizefilename) and use each title as a separate directory.

### `resolveNameAsFile`

Default resolver. Stores named snapshots as separate files in a directory named after the test.

```ts
test("named snapshots", async () => {
  // named_snapshots/snapshot_1.txt
  await expect("value 1").toMatchTextFile({ name: "snapshot 1" });
  // named_snapshots/snapshot_2.txt
  await expect("value 2").toMatchTextFile({ name: "snapshot 2" });
});
```

### `resolveNameAsFileSuffix`

Appends the `name` as suffix to the file name derived from the test title. This avoids creating an extra directory per test.

```ts
import { resolveNameAsFileSuffix } from "@cronn/lib-file-snapshots";

test("named snapshots", async () => {
  // named_snapshots_snapshot_1.txt
  await expect("value 1").toMatchTextFile({
    name: "snapshot 1",
    resolveFilePath: resolveNameAsFileSuffix,
  });
});
```

## Custom File Path Resolvers

### Compatibility with Existing Validation Files

The main use case for custom resolvers is reusing validation files which already exist in a project, e.g. when migrating from another or an older snapshot library with a different naming scheme. Instead of renaming all validation files, a resolver can reproduce the existing file paths.

For example, if existing validation files use the raw titles with spaces replaced by dashes:

```ts
import path from "node:path";

import type { FilePathResolverParams } from "@cronn/lib-file-snapshots";

function resolveLegacyFilePath(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const segments = name === undefined ? titlePath : [...titlePath, name];

  return path.join(
    testPath,
    ...segments.map((segment) => segment.replaceAll(" ", "-")),
  );
}
```

> [!CAUTION]
> This resolver performs only minimal normalization. Titles containing characters like `/`, `:` or `?` produce nested directories or invalid file names on some operating systems. Only use such resolvers when you control the titles.

### Custom Directory Layout

A resolver can also be used to change the directory layout, e.g. to store snapshots in a directory named after the `describe` block without a directory per test file:

```ts
import path from "node:path";

import {
  type FilePathResolverParams,
  normalizeFileName,
} from "@cronn/lib-file-snapshots";

function resolveWithoutTestPath(params: FilePathResolverParams): string {
  const { titlePath, name } = params;
  const segments = name === undefined ? titlePath : [...titlePath, name];

  return path.join(...segments.map(normalizeFileName));
}
```

Note that this resolver drops `testPath`, so snapshots of tests with the same titles in different test files collide. See [Avoiding Collisions](#avoiding-collisions).

## Avoiding Collisions

> [!WARNING]
> If two snapshots resolve to the same file path, they share the same validation and output file. One snapshot then overwrites the other, or tests are validated against the snapshot of a different test.

Normalization of titles and names is lossy, so different inputs can lead to the same file name. For example, using [`normalizeFileName`](#normalizefilename):

| Input                                          | Normalized          |
| ---------------------------------------------- | ------------------- |
| `"loads data (cached)"`, `"loads data cached"` | `loads_data_cached` |
| `"saves user?"`, `"saves user!"`               | `saves_user`        |
| `"a/b"`, `"ab"`                                | `ab`                |
| `"a b"`, `"a_b"`, `"a.b"`, `"a: b"`            | `a_b`               |

When writing a custom resolver, follow these rules to keep file paths unique:

- **Use all parameters:** Dropping `testPath`, parts of `titlePath` or `name` makes collisions between different tests or between multiple snapshots in the same test likely.
- **Keep segments separate:** Use a directory per segment (`path.join`) instead of concatenating segments into a single file name. When concatenating, use a separator which cannot result from normalizing a segment.
- **Prefer `normalizeFileName`:** It produces file names which are valid on all operating systems. Custom normalization tends to be either too lossy or not strict enough.
- **Keep titles unique:** Even with a well-designed resolver, normalization is lossy. Avoid titles which only differ in special characters.

**Example:** The following resolver concatenates all segments with `_`, which is also produced by `normalizeFileName` for whitespace:

```ts
// ❌ collisions between different tests
function resolveFlatFilePath(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const segments = name === undefined ? titlePath : [...titlePath, name];

  return path.join(testPath, segments.map(normalizeFileName).join("_"));
}

// user_login_fails
describe("user", () => {
  test("login fails", async () => {
    await expect(value).toMatchTextFile();
  });
});

// user_login_fails
test("user login fails", async () => {
  await expect(value).toMatchTextFile();
});
```

Using a separate directory per segment, as done by `resolveNameAsFile`, resolves the collision (`user/login_fails` and `user_login_fails`):

```ts
// ✅ separate directory per segment
function resolveNestedFilePath(params: FilePathResolverParams): string {
  const { testPath, titlePath, name } = params;
  const segments = name === undefined ? titlePath : [...titlePath, name];

  return path.join(testPath, ...segments.map(normalizeFileName));
}
```

## `normalizeFileName`

Normalizes a test title or snapshot name into a valid file name:

- removes emojis
- removes the characters ``+ * % ~ < > ? ! $ # ' " ` | \ / ( ) [ ] { }``
- replaces whitespace and the characters `. : , ;` with `_`
- collapses repeated `_`

```ts
import { normalizeFileName } from "@cronn/lib-file-snapshots";

normalizeFileName("applies discount: 10%"); // applies_discount_10
```
