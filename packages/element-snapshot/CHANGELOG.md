# @cronn/element-snapshot

## 0.18.0

### Minor Changes

- 2bc684c: Fix: Semantic snapshot does not simplify `combobox` with just name

### Patch Changes

- Updated dependencies [d97e811]
  - @cronn/lib-file-snapshots@1.1.1

## 0.17.0

### Minor Changes

- adc4dd0: Support `disabled` attribute on elements with role `option`
- 1b0d800: Fix: Semantic snapshot for `combobox` is missing included options when combobox has no attributes
- bf2874c: Always include `placeholder` attribute in input snapshots

### Patch Changes

- 551fb44: Export `SemanticSnapshotOptions` interface
- 1c2c517: Use `MarkdownTableSerializer` from lib-file-snapshots
- dc4ed4e: Rename `RadiogroupSnapshot` to `RadioGroupSnapshot`
- dc4ed4e: Rename `ColumnheaderSnapshot` to `ColumnHeaderSnapshot`
- Updated dependencies [022cf3b]
- Updated dependencies [6da034e]
  - @cronn/lib-file-snapshots@1.1.0

## 0.16.0

### Minor Changes

- 6ea31df: Breaking change: Rename `snapshotElement` to `semanticSnapshot`
- 6ea31df: Breaking change: Rename `snapshotElementRaw` to `rawSnapshot`

### Patch Changes

- 42307e8: Restructure READMEs to focus on getting started and link to documentation site

## 0.15.0

### Minor Changes

- a839880: Add label role for `label` and `legend` elements
- 8bf27b7: Merge consecutive text nodes in snapshots

### Patch Changes

- e8f7291: Export `SnapshotByRole` type
- 0c3864a: Export `MarkdownTableSnapshotOptions` type

## 0.14.1

### Patch Changes

- fd5f90b: Export `markdownTableSnapshot` function

## 0.14.0

### Minor Changes

- 63d9bda: Rename `filterSnapshots` to `filter`
- 9135923: Export filter predicates `includeRole` and `excludeRole`
- 2dfc9f5: Export `filterByRole` utility function
- bdfdf61: Export `getTextContent` utility function
- 30144e1: Add markdown table snapshot format for tables and grids
- 0583ebb: Fix: Make `recurse` optional in `SnapshotFilterOptions`

### Patch Changes

- a95660f: Fix: Text snapshot has empty children after filtering

## 0.13.0

### Minor Changes

- e74bdf4: Make `attributes` and `children` required fields in `GenericElementSnapshot`
- 3888abb: Make `options` required field in `ComboboxSnapshot`

### Patch Changes

- 1b737a6: Define full git URL for `repository.url` in `package.json`

## 0.12.0

### Minor Changes

- d9447bd: Add `recurseFilter` option to control filter recursion behavior
- 295576b: Introduce role `descriptionlist` for HTML description list element
- 7daa13f: Ignore images without name
- b7ef2b2: Export `filterSnapshots` utility function

### Patch Changes

- 5212760: Export `ImageSnapshot` and `SeparatorSnapshot` types

## 0.11.0

### Minor Changes

- 39b52c2: Fix: Numeric attribute with non-numeric value is parsed to NaN
- 52805ef: Fix: Treat all children of `progressbar` and `separator` elements as presentational
- 45d6beb: Fix: Hidden text content is included in accessible name

### Patch Changes

- 93e2ae6: Migrate from tsup to tsdown

## 0.10.0

### Minor Changes

- c112776: Snapshot `hr` elements and elements with role `separator`
- 3e95a75: Snapshot `svg` elements
- 62506e6: Add option `filter` to selectively include elements in the snapshot
- 412f2d1: Snapshot `img` elements and elements with role `img`

## 0.9.0

### Minor Changes

- 5046371: Breaking change: Move element snapshot functions to `@cronn/element-snapshot`

### Patch Changes

- 908c982: Export type `RadiogroupSnapshot`

## 0.8.0

### Minor Changes

- ef9a49a: Snapshot element with role `radiogroup`
- 1dad07c: Fix: Internal value of element with role `radio` is visible in snapshot
- c47a0c2: Fix: Element snapshot of role-based `combobox` element is missing when the element is collapsed
- aaf981b: Fix: Value for input- and button-based `combobox` elements is not resolved from visible value
- c47a0c2: Include `options` in snapshot for `combobox` element even when it is collapsed

## 0.7.0

### Minor Changes

- a33a2f6: Snapshot elements with role `progressbar`

## 0.6.0

### Minor Changes

- 37b43d6: Snapshot buttons with role `combobox`
- f1367bf: Snapshot elements with role `group`
- 9009cb4: Snapshot attributes `aria-readonly` and `aria-required` on input elements

## 0.5.0

### Minor Changes

- 9aa2f69: Add `pressed` attribute to element snapshot for role `button`

## 0.4.0

### Minor Changes

- 9daed44: Expose all element snapshot types

## 0.3.0

### Minor Changes

- a1c7bba: Add `sort` attribute to element snapshot for role `columnheader`
- a9baddc: Expose types `NodeRole` and `ElementRole`
- 35faaa1: Snapshot attributes `url` and `disabled` for elements with role `menuitem`

## 0.2.0

### Minor Changes

- 495edc9: Fix: Package element-snapshot cannot be published

## 0.1.0

### Minor Changes

- be14dd0: Initial release
