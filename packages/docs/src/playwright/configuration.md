# Configuration

Configuration options can be passed when defining the file matchers:

```ts [fixtures.ts]
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

const expect = defineFileSnapshotMatchers({
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
