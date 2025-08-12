# File Snapshot Testing

This is a monorepo for writing tests with file snapshots, providing integrations
for different testing libraries.

## Available Integrations

- [playwright-file-snapshots](packages/playwright-file-snapshots/README.md)
- [vitest-file-snapshots](packages/vitest-file-snapshots/README.md)

## File Snapshots

### Introduction

File snapshots are stored in two directories: `validationDir` and `outputDir`. `validationDir` contains the golden masters which should be under version control. `outputDir` contains the snapshots from the latest test run.
By default, the directories are located under `/data/test/validation` and `/data/test/output`.

Using two directories to store snapshots enables diffing using directory comparison. This gives fine-grained control when updating snapshots and facilitates features like detecting unused snapshots.

### Adding New File Snapshots

When no validation file exists for a file snapshot, a new validation file is created containing a marker in the first line:

```
===== missing file =====
```

This explicitly marks the file as new. To use the snapshot as validation file:

- Remove the marker line from the file
- Add the file to version control

### Updating Changed File Snapshots

Each test run generates new file snapshots in `outputDir`. Differences can be viewed using directory comparison.

If a file snapshot changed intentionally:

- Apply the changes to the validation files
- Commit the changed validation file to version control

### Tips and Tricks

#### Navigating to validation files

Since validation files are named after the test, you can navigate to a validation file by using file search with the test title (e.g. `Ctrl + Shift + N` in IntelliJ)

#### Clearing the output directory

When regularly switching between branches with changed validation files, it can be helpful to clear the output directory. Otherwise, updated validation files will appear in the diff even though they did not change in the current branch.

#### Removing unused validation files

Unused validation files are validation files from tests which no longer exist, e.g. because the test was renamed or deleted. To avoid confusion, unused validation files should always be deleted.

### Tools for Comparing File Snapshots

Effectively working with file snapshots requires a tool which supports comparing directories. We can recommend the following tools:

- [Validation-File Comparison Plugin for IntelliJ IDEs](https://github.com/cronn/validation-files-comparison-intellij-plugin) (does not yet support frontend monorepos)
- [Meld](https://meldmerge.org)

### See Also

- [File Snapshots for Java](https://github.com/cronn/validation-file-assertions)
