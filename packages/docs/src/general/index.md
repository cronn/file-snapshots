# Introduction

File snapshot testing is a powerful approach to test-driven development that stores expected outputs as separate files. This monorepo provides integrations for different testing frameworks, making it easy to adopt file snapshot testing in your projects.

## What are File Snapshots?

File snapshots are stored in two directories: `validationDir` and `outputDir`.

- **`validationDir`** contains the golden masters which should be under version control
- **`outputDir`** contains the snapshots from the latest test run

By default, the directories are located under `/data/test/validation` and `/data/test/output`.

Within both directories, file snapshots are named after the test file and the hierarchy of test titles. The file path can be customized using [File Path Resolvers](/general/file-path-resolvers).

Using two directories to store snapshots enables diffing using directory comparison. This gives fine-grained control when updating snapshots and facilitates features like detecting unused snapshots.

## Available Integrations

This monorepo provides file snapshot testing support for:

- **[Playwright File Snapshots](/playwright/)** - For end-to-end testing with Playwright
- **[Vitest File Snapshots](/vitest/)** - For unit and integration testing with Vitest

## Working with File Snapshots

### Adding New File Snapshots

When no validation file exists for a file snapshot, a new validation file is created from the actual value. The assertion fails on this first run, so new file snapshots are always explicitly noticed. Subsequent runs compare against the created validation file.

To use the snapshot as validation file:

1. Review the created validation file
2. Add the file to version control

### Updating Changed File Snapshots

Each test run generates new file snapshots in `outputDir`. Differences can be viewed using directory comparison.

If a file snapshot changed intentionally:

1. Apply the changes to the validation files
2. Commit the changed validation file to version control

## Tips and Tricks

### Navigating to Validation Files

Since validation files are named after the test, you can navigate to a validation file by using file search with the test title (e.g. `Ctrl + Shift + N` in IntelliJ).

### Clearing the Output Directory

When regularly switching between branches with changed validation files, it can be helpful to clear the output directory. Otherwise, updated validation files will appear in the diff even though they did not change in the current branch.

### Removing Unused Validation Files

Unused validation files are validation files from tests which no longer exist, e.g. because the test was renamed or deleted. To avoid confusion, unused validation files should always be deleted.

## Tools for Comparing File Snapshots

Effectively working with file snapshots requires a tool which supports comparing directories. We recommend the following tools:

- [Validation-File Comparison Plugin for IntelliJ IDEs](https://github.com/cronn/validation-files-comparison-intellij-plugin) (does not yet support frontend monorepos)
- [Compare Folders Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=moshfeu.compare-folders)
- [Meld](https://meldmerge.org)

## See Also

- [File Snapshots for Java](https://github.com/cronn/validation-file-assertions)
