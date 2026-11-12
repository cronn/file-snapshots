---
"@cronn/element-snapshot": patch
---

Detect hidden elements by their computed style instead of the `hidden` attribute: Elements with a `hidden` attribute overridden by CSS are now included, while content of closed `<details>` elements and elements with `content-visibility: hidden` is now excluded
