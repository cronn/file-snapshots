---
"@cronn/lib-file-snapshots": minor
"@cronn/vitest-file-snapshots": minor
"@cronn/playwright-file-snapshots": minor
---

Remove the `===== missing file =====` marker from newly created validation files. New file snapshots still fail on the first run, but subsequent runs pass without manually editing the validation file.
