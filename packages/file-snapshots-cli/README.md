# File Snapshots CLI

CLI for maintaining file snapshots: find and delete unused validation files and clean output directories.

[Read the full documentation](https://cronn.github.io/file-snapshots/general/cli)

## How It Works

Every test run writes a file snapshot to the output directory for each assertion, whether or not it matches the validation file. A validation file without a corresponding output file therefore belongs to a test which no longer exists, e.g. because the test was renamed or deleted.

> [!IMPORTANT]
> Unused validation files can only be detected reliably after running the complete test suite. Run the CLI only after all tests which write file snapshots have finished, and never after running a filtered subset of tests.

## Installation

```shell
pnpm add -D @cronn/file-snapshots-cli
```

```shell
npm install -D @cronn/file-snapshots-cli
```

```shell
yarn add -D @cronn/file-snapshots-cli
```

## Usage

Run the CLI after running all tests:

```shell
# fail if a validation file was not written by the last test run
file-snapshots check

# delete validation files not written by the last test run
file-snapshots prune

# delete the output directories
file-snapshots clean
```

Clear the output directories using `file-snapshots clean` before running the tests. Otherwise, output files from previous test runs can hide unused validation files.

### Custom Directories

By default, the CLI expects the `validation` and `output` directories in `data/test`. When tests use custom directories, pass the parent directory of each pair:

```shell
file-snapshots check --dir data/unit-test --dir data/e2e-test
```

### Ignoring Validation Files

Exclude validation files which are only written in some test runs, e.g. platform-specific tests, using glob patterns relative to the `validation` directory:

```shell
file-snapshots check --ignore "smoke/**"
```

Run `file-snapshots --help` for all options.

## Running in CI

Add a script to your `package.json` and run it after the tests:

```json
{
  "scripts": {
    "test": "vitest run",
    "snapshots:check": "file-snapshots check"
  }
}
```

```yaml
steps:
  - name: Run tests
    run: pnpm run test
  - name: Check for unused file snapshots
    run: pnpm run snapshots:check
```
