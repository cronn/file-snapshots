# Configuration

## Matcher Options

Matcher options can be passed when registering the matchers in the setup file:

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

## File Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

```ts
expect(value).toMatchJsonFile({
  name: "snapshot",
});
```

### Common Options

| Option            | Default Value       | Description                                                                                             |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| `name`            | `undefined`         | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. |
| `normalizers`     | `[]`                | Custom normalizers to apply before serialization.                                                       |
| `resolveFileName` | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                              |

### JSON Snapshot Options

| Option                             | Default Value | Description                                                                 |
| ---------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted. |

### Text Snapshot Options

| Option          | Default Value | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `fileExtension` | `txt`         | File extension used for storing the text file. |
