---
"@cronn/playwright-file-snapshots": patch
"@cronn/element-snapshot": patch
"@cronn/aria-snapshot": patch
---

Filter `expect` steps with complex locator expressions.
Match any locator expression instead of only simple single-method locators, enabling support for chained locator methods like `locator('body').getByRole('textbox', { name: 'my-input' })`.
