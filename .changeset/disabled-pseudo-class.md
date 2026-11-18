---
"@cronn/element-snapshot": patch
---

Resolve the `disabled` attribute using the browser's computed disabled state. Form controls disabled via `<fieldset disabled>`, `<optgroup disabled>`, a disabled `<select>` or `ElementInternals` are now snapshotted as `disabled`
