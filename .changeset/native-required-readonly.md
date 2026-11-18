---
"@cronn/element-snapshot": patch
---

Resolve the `readonly` and `required` attributes using the browser's native state. The attributes are no longer snapshotted on elements that don't support them, such as `readonly` on `<select>` or checkboxes and `required` on range inputs
