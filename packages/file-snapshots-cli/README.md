# File Snapshots CLI

CLI for maintaining file snapshots: find and delete unused validation files and clean output directories.

[Read the full documentation](https://cronn.github.io/file-snapshots/general/cli)

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
