---
"@cronn/element-snapshot": minor
---

Add support for elements with `role="tree"` and `role="treeitem"`

Tree widgets were previously dropped from snapshots together with their subtree unless elements with implicit ARIA roles were used. A `tree` is now snapshotted as a named container, and a `treeitem` within a tree reports its ARIA states as `expanded`, `checked`, `selected` and `disabled` attributes. `aria-checked="mixed"` is preserved as `"mixed"`, and nested items wrapped in `role="group"` are snapshotted as children.

See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tree_role
