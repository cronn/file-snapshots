# CLI

The `@cronn/file-snapshots-cli` package provides the `file-snapshots` command for maintaining file snapshots:

- find unused validation files, e.g. to fail a CI pipeline
- delete unused validation files
- clean the output directories

## Installation

::: code-group

```shell [pnpm]
pnpm add -D @cronn/file-snapshots-cli
```

```shell [npm]
npm install -D @cronn/file-snapshots-cli
```

```shell [yarn]
yarn add -D @cronn/file-snapshots-cli
```

:::

## Detecting Unused Validation Files

Every test run writes a file snapshot to `outputDir` for each assertion, regardless of whether the validation file matches. A validation file without a corresponding file in `outputDir` therefore belongs to a test which no longer exists, e.g. because the test was renamed or deleted.

> [!IMPORTANT]
> Unused validation files can only be detected reliably after running the complete test suite. Run the CLI only after all tests which write file snapshots have finished, and never after running a filtered subset of tests.

> [!TIP]
> Clear the output directories using `file-snapshots clean` before running the tests. Otherwise, output files from previous test runs can hide unused validation files.

## Usage

```shell
file-snapshots <command> [options]
```

The following commands are available:

| Command | Description                                                               |
| ------- | ------------------------------------------------------------------------- |
| `check` | Lists unused validation files and fails if at least one has been found    |
| `prune` | Deletes unused validation files, including directories which become empty |
| `clean` | Deletes the output directories                                            |

The following options are available:

| Option            | Default     | Description                                                                                                                    |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `--dir <dir>`     | `data/test` | Directory containing the `validation` and `output` directories. Can be specified multiple times.                               |
| `--ignore <glob>` |             | Validation files to exclude from `check` and `prune`, relative to the `validation` directory. Can be specified multiple times. |
| `-h`, `--help`    |             | Prints the help                                                                                                                |
| `-v`, `--version` |             | Prints the version                                                                                                             |

Relative paths are resolved against the current working directory.

## Examples

### Check for Unused Validation Files

```shell
file-snapshots check
```

**Output:**

```
Found 1 unused validation file(s):
  • data/test/validation/user-profile/renders_avatar.json

Run "file-snapshots prune" to delete them.
If a file is only written in some test runs, exclude it with --ignore <glob>.
```

### Delete Unused Validation Files

```shell
file-snapshots prune
```

**Output:**

```
Deleted data/test/validation/user-profile/renders_avatar.json
Deleted 1 unused validation file(s).
```

### Clean Output Directories

```shell
file-snapshots clean
```

### Use Multiple Directories

When tests are configured with custom `validationDir` and `outputDir` options, pass the parent directory of each pair:

```shell
file-snapshots check --dir data/unit-test --dir data/e2e-test
```

The directories are expected to contain `validation` and `output` directories, e.g. `data/unit-test/validation` and `data/unit-test/output`.

### Ignore Validation Files

Some validation files are only written in specific test runs, e.g. tests which only run on a specific platform. Exclude them using glob patterns:

```shell
file-snapshots check --ignore "smoke/**" --ignore "**/*_windows.txt"
```

Each pattern must match at least one validation file. This prevents outdated patterns from silently hiding unused validation files.

## Running in CI

Add scripts for running the tests and checking for unused validation files to `package.json`:

::: code-group

```json [Vitest]
{
  "scripts": {
    "test": "vitest run",
    "snapshots:check": "file-snapshots check"
  }
}
```

```json [Playwright]
{
  "scripts": {
    "test": "playwright test",
    "snapshots:check": "file-snapshots check"
  }
}
```

:::

Run the check after the tests:

```yaml [.github/workflows/ci.yml]
steps:
  # ...
  - name: Run tests
    run: pnpm run test
  - name: Check for unused file snapshots
    run: pnpm run snapshots:check
```

> [!NOTE]
> When tests are sharded across multiple CI jobs, each job only writes the output files of its own shard. Collect the output directories of all shards, e.g. as artifacts, and run the check in a subsequent job.
