# File Snapshot Testing

File snapshot testing is a powerful approach to test-driven development that stores expected outputs as separate files. This monorepo provides integrations for different testing frameworks, making it easy to adopt file snapshot testing in your projects.

## Documentation

For full documentation, visit [cronn.github.io/file-snapshots](https://cronn.github.io/file-snapshots/).

## Available Integrations

- [`@cronn/playwright-file-snapshots`](packages/playwright-file-snapshots/README.md) — Snapshot testing for Playwright
- [`@cronn/vitest-file-snapshots`](packages/vitest-file-snapshots/README.md) — Snapshot testing for Vitest

## Further Packages

- `@cronn/lib-file-snapshots` — Library for snapshot testing
- [`@cronn/element-snapshot`](packages/element-snapshot/README.md) — Element snapshots for Playwright
- [`@cronn/aria-snapshot`](packages/aria-snapshot/README.md) — JSON-based ARIA snapshots for Playwright

## Related Integrations

- [File Snapshots for JUnit](https://github.com/cronn/validation-file-assertions)

## Development

This monorepo uses [Turborepo](https://turborepo.com/) as build system.

### Common Tasks

| Command            | Description                                                                       |
| ------------------ | --------------------------------------------------------------------------------- |
| `pnpm turbo check` | Runs code checks, including TypeScript compilation, linting, formatting and tests |
| `pnpm turbo fix`   | Applies automatic fixes, including linting and formatting                         |
| `pnpm turbo build` | Runs the build                                                                    |
| `pnpm turbo ci`    | Runs all tasks required for CI, including checks and builds                       |
| `pnpm turbo clean` | Removes all build outputs and caches                                              |

To run tasks for a specific package only, use [filters](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```shell
pnpm turbo --filter=@cronn/playwright-file-snapshots check
```

### Testing packages locally

Using `pnpm link`, you can test a local package in another local project.

**Make local package accessible system-wide (e.g. `@cronn/playwright-file-snapshots`)**

```sh
pnpm link packages/playwright-file-snapshots
```

**Link local package from another project**

```sh
cd path/to/project
pnpm link @cronn/playwright-file-snapshots
```

This replaces the package in `node_modules` with the local version.

### Editor Setup

#### IntelliJ IDEA

**Recommended Plugins:**

- [Oxc](https://plugins.jetbrains.com/plugin/27061-oxc) for formatting

#### VS Code

If you configured a default formatter on language level in your user settings, you need to remove it or replace it by `oxc.oxc-vscode` to use oxfmt as formatter.
