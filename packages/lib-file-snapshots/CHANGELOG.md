# @cronn/lib-file-snapshots

## 0.11.0

### Minor Changes

- 26fe3b4: Simplify `ValidationFileMatcher` interface
- 0e0681b: Provide `isValidationFileMissing` in `ValidationFileMatcherResult`
- eff0212: Add distinct error message for missing validation file
- 923b9c2: Simplify serializer interface
- 77e864a: Write snapshot files explicitly instead of implicitly

### Patch Changes

- 2a35553: Simplify creation of snapshot directories

## 0.10.0

### Minor Changes

- 3437498: Remove Emojis from filenames

## 0.9.0

### Minor Changes

- 8bdd71a: Breaking change: Array items now use `index` instead of `key` in `JsonNormalizerContext`
- 8bdd71a: Add index of array item as explicit property to `JsonNormalizerContext`

## 0.8.0

### Minor Changes

- d33e703: Remove more special characters from file names, including quotes and brackets
- 0695b55: Introduce `namingStrategy` to `ValidationFileMatcher`, defaulting to `file`
- d33e703: Normalize all whitespace characters in file names

## 0.7.0

### Minor Changes

- 21adc17: Remove $ from snapshot file names

## 0.6.0

### Minor Changes

- 3e556d6: Expose guards

## 0.5.0

### Minor Changes

- a456239: Enable definition of custom normalizers for `TextSerializer` and `JsonSerializer`

## 0.4.0

### Minor Changes

- 8dd1d95: Remove obsolete `CompositeSerializer`

### Patch Changes

- b3f93ce: Change repo URLs after rename
- 082aa27: Export interface `SnaphotSerializer`

## 0.3.0

### Minor Changes

- f73c90b: Breaking change: Move baseDir handling to vitest-file-snapshots and rename parameter to testDir
- 2977b53: Rename validation file matcher options for clarity

### Patch Changes

- 7ac4e8d: chore(deps): bump the vitest group with 3 updates
- 1dadd57: refactor: Extract message to lib-file-snapshots

## 0.2.0

### Minor Changes

- 4fc3c09: Generalize serializers and extract validation file matcher

### Patch Changes

- a2a8534: chore(deps): bump @types/node from 22.15.21 to 22.15.29

## 0.1.0

### Minor Changes

- 12d4a0b: Initial release

### Patch Changes

- 25931bc: Update dependencies
