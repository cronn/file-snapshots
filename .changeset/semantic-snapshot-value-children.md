---
"@cronn/element-snapshot": patch
---

Omit children in semantic snapshots when they are text only and equal to the `value` attribute

```json
// Before
{ "combobox": "Combobox", "value": "Selected Value", "children": "Selected Value" }

// After
{ "combobox": "Combobox", "value": "Selected Value" }
```
