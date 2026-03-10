# Configuration

## Matcher Options

Matcher options can be passed when defining the matcher:

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect({
  validationDir: "custom-validation",
  outputDir: "custom-output",
});
```

| Option            | Default Value          | Description                                                         |
| ----------------- | ---------------------- | ------------------------------------------------------------------- |
| `validationDir`   | `data/test/validation` | Directory in which golden masters are stored.                       |
| `outputDir`       | `data/test/output`     | Directory in which file snapshots from test runs are stored.        |
| `indentSize`      | `2`                    | Indentation size in spaces used for serializing snapshots.          |
| `resolveFileName` | `resolveNameAsFile`    | Custom resolver for the file path used to store snapshots.          |
| `updateDelay`     | `250`                  | Delay in ms before repeatable snapshots are created in update mode. |

## File Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

```ts
await expect(value).toMatchTextFile({
  name: "snapshot",
});
```

| Option            | Default Value       | Description                                                                                             |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| `name`            | `undefined`         | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. |
| `normalizers`     | `[]`                | Custom normalizers to apply before serialization.                                                       |
| `timeout`         | expect timeout      | Retries the snapshot until it passes or the timeout value is reached.                                   |
| `resolveFileName` | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                              |
| `updateDelay`     | `250`               | Delay in ms before repeatable snapshots are created in update mode.                                     |

### JSON Snapshot Options

| Option                             | Default Value | Description                                                                 |
| ---------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted. |

### Text Snapshot Options

| Option          | Default Value | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `fileExtension` | `txt`         | File extension used for storing the text file. |
