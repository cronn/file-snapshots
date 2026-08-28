---
"@cronn/element-snapshot": minor
---

Add support for snapshotting `Page` targets

When a Page is passed as target to `rawSnapshot`, `semanticSnapshot` or `expect.toMatchSemanticSnapshotFile`, the snapshot covers the `<body>` of the page.
