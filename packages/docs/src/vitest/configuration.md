# Configuration

Configuration options can be passed when registering the file matchers in the setup file:

```ts
registerValidationFileMatchers({
  testDir: "src",
});
```

### Available Options

| Option            | Default Value          | Description                                                                               |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `testDir`         | `.`                    | Base directory for tests. The paths of snapshot files will be relative to this directory. |
| `validationDir`   | `data/test/validation` | Directory in which golden masters are stored.                                             |
| `outputDir`       | `data/test/output`     | Directory in which file snapshots from test runs are stored.                              |
| `indentSize`      | `2`                    | Indentation size in spaces used for serializing snapshots.                                |
| `resolveFileName` | `resolveNameAsFile`    | Custom resolver for the file path used to store snapshots.                                |
