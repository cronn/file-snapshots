# @cronn/playwright-file-snapshots

## 0.19.0

### Minor Changes

- 976ffb1: Fix: Default `validationDir` and `outputDir` depend on CWD
- e6701cd: Filter irrelevant and not yet supported elements from DOM snapshots
- c0402bb: Add disabled state to DOM snapshot of button
- 976ffb1: Enable defining default `validationDir` and `outputDir` with framework-dependent absolute path

### Patch Changes

- Updated dependencies [976ffb1]
  - @cronn/lib-file-snapshots@0.15.0

## 0.18.0

### Minor Changes

- 70a6d51: Validate context-dependent element roles in DOM snapshots

## 0.17.0

### Minor Changes

- c4ffc11: Breaking change: Removed config option `soft` with default value `true`. Use `defineValidationFileExpect().configure({ soft: true })` to restore the old behavior.

## 0.16.0

### Minor Changes

- 366ba5f: Enable DOM Snapshots for the roles `grid` and `gridcell`

### Patch Changes

- 1afaceb: Fix: `package-directory` is not defined as production dependency

## 0.15.2

### Patch Changes

- dbd5efc: Fix: Snapshot library is imported using wrong path when installed as dependency

## 0.15.1

### Patch Changes

- 2dd2ef2: Fix: DOM Snapshot library is missing in published package

## 0.15.0

### Minor Changes

- 63b1fe7: Resolve `titlePath` from `TestStepInfo` (introduced in Playwright 1.55.0)

## 0.14.0

### Minor Changes

- 760c65b: Breaking change: Removed configuration option `filterSteps` in favor of `resolveFilePath`
- 760c65b: Introduced option `resolveFilePath` on configuration and matcher level to enable custom file paths
- 760c65b: Breaking change: Removed matcher option `namingStrategy` in favor of `resolveFilePath`

### Patch Changes

- Updated dependencies [760c65b]
  - @cronn/lib-file-snapshots@0.14.0

## 0.13.0

### Minor Changes

- 2000932: Snapshot landmarks
- 5ce17e8: Exclude elements with `aria-hidden="true"` from DOM Snapshots
- 0615e16: Snapshot description lists
- 137bbec: Snapshot tables
- f5c172a: Snapshot descriptions
- 506f9cb: Ignore elements with `role="presentation"` and `role="none"` in DOM Snapshots

### Patch Changes

- c9f1d67: Fix: Explicit element roles of container elements are not validated
- d37bf2a: Fix: `li` is resolved to `listitem` outside list

## 0.12.0

### Minor Changes

- 756a233: Snapshot elements with role `combobox`
- 9fe8f39: Snapshot multi select elements
- 2152587: Exclude combobox options from DOM Snapshots by default
- 2152587: Add DOM Snapshot option `includeComboboxOptions`
- 62a2b52: Enable configuration of `indentSize` for JSON file snapshots

### Patch Changes

- Updated dependencies [62a2b52]
  - @cronn/lib-file-snapshots@0.13.0

## 0.11.0

### Minor Changes

- 84ad807: Introduce DOM Snapshots (experimental)

## 0.10.0

### Minor Changes

- 78c9704: Breaking change: All file matchers are now asynchronous and must be awaited
- 78c9704: Breaking change: Promise values passed to file matchers are now automatically awaited
- 78c9704: Introduce snapshot retries

### Patch Changes

- Updated dependencies [77a885b]
  - @cronn/lib-file-snapshots@0.12.0

## 0.9.0

### Minor Changes

- 5685183: Fix: expect.toPass steps appear in title path

### Patch Changes

- 26fe3b4: Simplify `ValidationFileMatcher` interface
- 554c6aa: Rename actual file to output file for consistency
- Updated dependencies [26fe3b4]
- Updated dependencies [0e0681b]
- Updated dependencies [2a35553]
- Updated dependencies [eff0212]
- Updated dependencies [923b9c2]
- Updated dependencies [77e864a]
  - @cronn/lib-file-snapshots@0.11.0

## 0.8.2

### Patch Changes

- Updated dependencies [3437498]
  - @cronn/lib-file-snapshots@0.10.0

## 0.8.1

### Patch Changes

- Updated dependencies [8bdd71a]
- Updated dependencies [8bdd71a]
  - @cronn/lib-file-snapshots@0.9.0

## 0.8.0

### Minor Changes

- 46b2c56: Fix: Matcher error message is not visible
- 46b2c56: Make soft assertion behavior configurable

### Patch Changes

- ac8d724: Improve matcher error message
- 49bd0d7: Fix: Snapshot name is used as matcher name

## 0.7.0

### Minor Changes

- 8eb76f5: Introduce option `namingStrategy` for file matchers
- 8eb76f5: Breaking change: Use `file` as default `namingStrategy`

### Patch Changes

- Updated dependencies [d33e703]
- Updated dependencies [0695b55]
- Updated dependencies [d33e703]
  - @cronn/lib-file-snapshots@0.8.0

## 0.6.0

### Minor Changes

- 7a612c3: Fix: Sibling test steps are included in snapshot file path

### Patch Changes

- Updated dependencies [21adc17]
  - @cronn/lib-file-snapshots@0.7.0

## 0.5.0

### Minor Changes

- 9c1f044: Enable filtering test steps which should not be part the snapshot file path

### Patch Changes

- 1275d95: Re-export normalizer types from lib-file-snapshots to avoid importing from implicit dependency

## 0.4.0

### Minor Changes

- bb16c6a: Introduce JSON-based ARIA snapshots

### Patch Changes

- Updated dependencies [3e556d6]
  - @cronn/lib-file-snapshots@0.6.0

## 0.3.1

### Patch Changes

- 640772f: Expose interfaces for matcher options

## 0.3.0

### Minor Changes

- ae4de2c: Enable definition of custom normalizers for `toMatchTextFile` and `toMatchJsonFile`

### Patch Changes

- Updated dependencies [a456239]
  - @cronn/lib-file-snapshots@0.5.0

## 0.2.0

### Minor Changes

- 3d9d692: Breaking change: Replaced `toMatchValidationFile` by file-based matchers `toMatchJsonFile` and `toMatchTextFile`.

### Patch Changes

- b3f93ce: Change repo URLs after rename
- Updated dependencies [8dd1d95]
- Updated dependencies [b3f93ce]
- Updated dependencies [082aa27]
  - @cronn/lib-file-snapshots@0.4.0

## 0.1.0

### Minor Changes

- e5a8257: Initial release
