# Getting Started

## Installation

Add the library to your project using your preferred package manager:

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

### Register Custom Matchers

Import the custom matchers in your `vitest-setup.ts`:

```ts
import { registerValidationFileMatchers } from "@cronn/vitest-file-snapshots/register";

registerValidationFileMatchers();
```

### Create Setup File

If you don't have a setup file in your project, create it and add it to your `vitest.config.ts`:

```ts
{
  test: {
    setupFiles: ["vitest-setup.ts"];
  }
}
```

### TypeScript Configuration

To get proper typings in TypeScript, add the `vitest-setup.ts` to your `tsconfig.json`:

```json
{
  "include": ["vitest-setup.ts"]
}
```

### Configure `.gitignore`

All file snapshots are generated to `/data/test`. The golden masters are stored in `/data/test/validation`, which should be under version control. The file snapshots generated for test runs are stored under `/data/test/output` and should be ignored:

```
# file snapshots
/data/test/output
```
