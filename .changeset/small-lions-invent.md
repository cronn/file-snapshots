---
"@cronn/element-snapshot": minor
---

Add `defaultTransformer` option to replace the default transformation of semantic snapshots for all roles.

The transformer is applied to every snapshot passed to the default transformation, including the ones a role transformer delegates via the `transform` function of its context. Transformers registered for a role take precedence. Its own context provides the built-in `transform` function, which can be wrapped to keep the default serialization of descendants.
