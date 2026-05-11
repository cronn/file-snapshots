# @cronn/aria-snapshot

## 2.0.1

### Patch Changes

- 60fcb73: Filter `expect` steps with complex locator expressions.
  Match any locator expression instead of only simple single-method locators, enabling support for chained locator methods like `locator('body').getByRole('textbox', { name: 'my-input' })`.
- Updated dependencies [60fcb73]
  - @cronn/playwright-file-snapshots@2.0.1

## 2.0.0

### Major Changes

- 3434b50: Breaking change: Rename `snapshotAria` to `ariaSnapshot`
- 71b9b3c: Provide `toMatchAriaSnapshotFile` matcher

### Patch Changes

- Updated dependencies [a0d8450]
- Updated dependencies [bc699fa]
- Updated dependencies [1d9e54e]
  - @cronn/playwright-file-snapshots@2.0.0

## 1.0.1

### Patch Changes

- 42307e8: Restructure READMEs to focus on getting started and link to documentation site

## 1.0.0

### Major Changes

- 3da5fd7: Release v1

### Patch Changes

- 1b737a6: Define full git URL for `repository.url` in `package.json`

## 0.1.1

### Patch Changes

- 93e2ae6: Migrate from tsup to tsdown

## 0.1.0

### Minor Changes

- a9b2c00: Breaking change: Extract `snapshotAria` to package `@cronn/aria-snapshot`
