# @cronn/element-snapshot

## 0.13.0

### Minor Changes

- e74bdf4: Make `attributes` and `children` required fields in `GenericElementSnapshot`
- 3888abb: Make `options` required field in `ComboboxSnapshot`

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
