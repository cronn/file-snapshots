---
"@cronn/element-snapshot": minor
---

Add `transformers` option to replace the default transformation of semantic snapshots per role.

Transformers are keyed by role and applied after the filter, but before the default serialization. They may return any JSON-serializable value, and receive a context providing the recursive default `transform` function to transform untransformed children.

The existing combobox handling is now a built-in transformer, exported as `comboboxTransformer`.
