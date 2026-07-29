---
"@cronn/element-snapshot": minor
---

Flatten structure of semantic snapshots

**Breaking change**: Semantic snapshots now have a different structure. To update existing snapshots, use Playwright's `--update-snapshots` flag.

Before:

```json
{
  "heading": {
    "name": "Heading",
    "level": 1
  }
}
```

After:

```json
{
  "heading": "Heading",
  "level": 1
}
```
