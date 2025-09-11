---
"@cronn/playwright-file-snapshots": minor
---

Breaking change: Removed config option `soft` with default value `true`. Use `defineValidationFileExpect().configure({ soft: true })` to restore the old behavior.
