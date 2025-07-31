# @cronn/playwright-file-snapshots

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
