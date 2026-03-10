# Vitest File Snapshots

Write tests with Vitest using file snapshots.

## Motivation

Vitest already provides assertions for snapshot testing, but they come with drawbacks:

- `toMatchSnapshot` serializes all snapshots into a single file using a custom format. This makes it harder to read snapshot files, because syntax highlighting is limited. In addition, reviewing larger snapshots in mixed snapshot files can become difficult.
- `toMatchFileSnapshot` serializes a snapshot into a single file, but requires explicit configuration of the filename and extension, which can become cumbersome when writing a lot of snapshot assertions.

`vitest-file-snapshots` provides an alternative solution to file snapshots with the following features:

- **Zero configuration**: snapshot files are named based on the test name
- **Multiple snapshot formats**: JSON, text
- **Automatic serialization**: native JS values like `undefined`, `Number.NaN` or `Date` objects in JSON

## Quick Start

Install the package:

::: code-group

```shell [pnpm]
pnpm add -D @cronn/vitest-file-snapshots
```

```shell [npm]
npm install -D @cronn/vitest-file-snapshots
```

```shell [yarn]
yarn add -D @cronn/vitest-file-snapshots
```

:::

Register the custom matchers in your `vitest-setup.ts`:

```ts
import { registerValidationFileMatchers } from "@cronn/vitest-file-snapshots/register";

registerValidationFileMatchers();
```

Start writing tests:

```ts
test("value is expected value", () => {
  expect({ value: "expected value" }).toMatchJsonFile();
});

// value_is_expected_value.json
// {
//   "value": "expected value"
// }
```

## Next Steps

- [Getting Started](/vitest/getting-started) - Full setup instructions
- [Writing Tests](/vitest/writing-tests) - Learn how to write file snapshot tests
- [Configuration](/vitest/configuration) - Configure matcher and snapshot options
