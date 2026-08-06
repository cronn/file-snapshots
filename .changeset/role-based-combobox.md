---
"@cronn/element-snapshot": minor
---

Add support for arbitrary elements with `role="combobox"`

Previously only `<select>`, `<input role="combobox">` and `<button role="combobox">` were snapshotted as a combobox, while any other element with `role="combobox"` was silently dropped together with its subtree. Such elements are now snapshotted as well, using their accessible text content as `value` — which covers component libraries rendering a combobox as a `<div>`, e.g. the Material UI `Select`. In addition, `aria-expanded` is now reported as the `expanded` attribute of a combobox.
