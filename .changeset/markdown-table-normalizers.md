---
"@cronn/element-snapshot": minor
---

Support custom normalizers for Markdown table snapshots

`markdownTableSnapshot` accepts a `normalizers` option that is applied to every table cell before serialization. This allows masking dynamic values such as dates and IDs, either per cell or across the whole table snapshot.

**Breaking change:** The `normalizers` option of `toMatchMarkdownTableSnapshotFile` now takes Markdown Table normalizers instead of text normalizers. Text serializers applied after serialization, potentially breaking the Markdown Table format.
