# vitest-file-snapshots

Write tests with Vitest using file snapshots.

## Motivation

Vitest already provides assertions for snapshot testing, but they come with
drawbacks:

- `toMatchSnapshot` serializes all snapshots into a single file using a custom
  format. This makes it harder to read snapshot files, because syntax
  highlighting is limited. In addition, reviewing larger snapshots in mixed
  snapshot files can become difficult.
- `toMatchFileSnapshot` serializes a snapshot into a single file, but requires
  explicit configuration of the filename and extension, which can become
  cumbersome when writing a lot of snapshot assertions.

`vitest-file-snapshots` provides an alternative solution to file snapshots with
the following features:

- Zero configuration: snapshot files are named based on the test name
- Automatic serialization of snapshots as JSON (default) or text (string values
  only)
- Automatic serialization of native JS values like `undefined`, `Number.NaN` or
  `Date` objects.

## Getting Started

### Adding the library to your project

```shell
npm install -D @cronn/vitest-file-snapshots
```

```shell
yarn add -D @cronn/vitest-file-snapshots
```

```shell
pnpm add -D @cronn/vitest-file-snapshots
```

### Registering the Custom Matcher in your project

Import the Custom Matcher in your `vitest-setup.ts`:

```ts
import { registerValidationFileMatcher } from "@cronn/vitest-file-snapshots/matcher";

registerValidationFileMatcher();
```

If you don't have a setup file in your project, you need to create it and add it
to your `vitest.config.ts`:

```ts
{
  test: {
    setupFiles: ["vitest-setup.ts"]
  }
}
```

To get proper typings in TypeScript, the `vitest-setup.ts` needs to be added to
your `tsconfig.json`:

```json
{
  "include": [
    "vitest-setup.ts"
  ]
}
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

File snapshot assertions use the custom matcher `toMatchValidationFile`:

```ts
test("value is expected value", () => {
  expect({ value: "expected value" }).toMatchValidationFile();
});

// value_is_expected_value.json
// {
//   "value": "expected value"
// }
```

### Testing Multiple Expectations

```ts
function mapToString(value: boolean | number): string {
  return value.toString();
}

test("maps values to string", () => {
  expect({
    boolean: mapToString(true),
    positiveNumber: mapToString(1),
    negativeNumber: mapToString(-1),
  }).toMatchValidationFile();
});

// maps_values_to_string.json
// {
//   "boolean": "true",
//   "positiveNumber": "1",
//   "negativeNumber": "-1",
// }
```

### Using Soft Assertions

```ts
function mapValue(value: string): string {
  return `mapped ${value}`;
}

test("value is mapped", () => {
  const data = { value: "value" };
  expect.soft(initialValue).toMatchValidationFile({ name: "before" });
  expect.soft(mapValue(initialValue)).toMatchValidationFile({ name: "after" });
});

// value_is_mapped_before.json
// {
//   "value": "value"
// }

// value_is_mapped_after.json
// {
//   "value": "mapped value"
// }
```

## Configuration

### Matcher Options

Matcher options can be passed when registering the matcher in the setup file:

 ```ts
registerValidationFileMatcher({
  testDir: "src"
});
```

| Option          | Default Value          | Description                                                                               |
|-----------------|------------------------|-------------------------------------------------------------------------------------------|
| `testDir`       | `.`                    | Base directory for tests. The paths of snapshot files will be relative to this directory. |
| `validationDir` | `data/test/validation` | Directory in which golden masters are stored.                                             |
| `outputDir`     | `data/test/output`     | Directory in which file snapshots from test runs are stored.                              |


### Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

 ```ts
expect(value).toMatchValidationFile({
  includeUndefinedObjectProperties: true
});
```

| Option                             | Default Value | Description                                                                                               |
|------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------|
| `name`                             | `undefined`   | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`.   |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted.                               |
