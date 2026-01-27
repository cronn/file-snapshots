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
- Multiple snapshot formats: JSON, text
- Automatic serialization of native JS values like `undefined`, `Number.NaN` or
  `Date` objects in JSON

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

### Registering the Custom Matchers in your project

Import the Custom Matchers in your `vitest-setup.ts`:

```ts
import { registerValidationFileMatchers } from "@cronn/vitest-file-snapshots/register";

registerValidationFileMatchers();
```

If you don't have a setup file in your project, you need to create it and add it
to your `vitest.config.ts`:

```ts
{
  test: {
    setupFiles: ["vitest-setup.ts"];
  }
}
```

To get proper typings in TypeScript, the `vitest-setup.ts` needs to be added to
your `tsconfig.json`:

```json
{
  "include": ["vitest-setup.ts"]
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

### Testing Multiple Expectations in a Single File

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

// maps_values_to_string.json
// {
//   "boolean": "true",
//   "positiveNumber": "1",
//   "negativeNumber": "-1",
// }
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

### Named Snapshots

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

To change this behavior, you can use a different file path resolver:

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

### Using Soft Assertions

```ts
function mapValue(value: string): string {
  return `mapped ${value}`;
}

test("value is mapped", () => {
  const data = { value: "value" };
  expect.soft(initialValue).toMatchJsonFile({ name: "before" });
  expect.soft(mapValue(initialValue)).toMatchJsonFile({ name: "after" });
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

Matcher options can be passed when registering the matchers in the setup file:

```ts
registerValidationFileMatchers({
  testDir: "src",
});
```

| Option            | Default Value          | Description                                                                               |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `testDir`         | `.`                    | Base directory for tests. The paths of snapshot files will be relative to this directory. |
| `validationDir`   | `data/test/validation` | Directory in which golden masters are stored.                                             |
| `outputDir`       | `data/test/output`     | Directory in which file snapshots from test runs are stored.                              |
| `indentSize`      | `2`                    | Indentation size in spaces used for serializing snapshots.                                |
| `resolveFileName` | `resolveNameAsFile`    | Custom resolver for the file path used to store snapshots.                                |

### File Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

```ts
expect(value).toMatchJsonFile({
  name: "snapshot",
});
```

| Option            | Default Value       | Description                                                                                             |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| `name`            | `undefined`         | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. |
| `normalizers`     | `[]`                | Custom normalizers to apply before serialization.                                                       |
| `resolveFileName` | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                              |

#### JSON Snapshot Options

| Option                             | Default Value | Description                                                                 |
| ---------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted. |

#### Text Snapshot Options

| Option          | Default Value | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `fileExtension` | `txt`         | File extension used for storing the text file. |

## Updating Snapshots

Snapshots can be updated using Vitest's built-in support for snapshot updates:

- Using the CLI parameter `--update`
- Configuring the option `update` in your `vitest.config.ts`

By default, only missing validation files are written. When updates are enabled, existing validation files will also be overridden.

> [!NOTE]
> If you accidentally updated more snapshots than intended, you can revert the changes using your VCS and selectively apply updates by diffing the `validation` and `output` directories.
