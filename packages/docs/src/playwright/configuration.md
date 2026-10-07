# Configuration

Configuration options can be passed when defining the file matchers:

```ts [fixtures.ts]
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

const expect = defineFileSnapshotMatchers({
  validationDir: "custom-validation",
  outputDir: "custom-output",
});
```

| Option            | Default Value          | Description                                                                                                         |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `validationDir`   | `data/test/validation` | Directory in which golden masters are stored.                                                                       |
| `outputDir`       | `data/test/output`     | Directory in which file snapshots from test runs are stored.                                                        |
| `indentSize`      | `2`                    | Indentation size in spaces used for serializing snapshots.                                                          |
| `resolveFilePath` | `resolveNameAsFile`    | Custom resolver for the file path used to store snapshots. See [File Path Resolvers](/general/file-path-resolvers). |
| `updateDelay`     | `250`                  | Delay in ms before repeatable snapshots are created in update mode.                                                 |
