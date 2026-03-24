# Vitest File Snapshots

Write tests with Vitest using file snapshots.

[Read the full documentation](https://cronn.github.io/file-snapshots/vitest/)

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
import { registerValidationFileMatchers } from "@cronn/vitest-file-snapshots/register";

registerValidationFileMatchers();
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

**_value_is_expected_value.json_**

```json
{
  "value": "expected value"
}
```
