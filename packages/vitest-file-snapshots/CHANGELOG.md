# @cronn/vitest-file-snapshots

## 0.10.1

### Patch Changes

- Updated dependencies [77a885b]
  - @cronn/lib-file-snapshots@0.12.0

## 0.10.0

### Minor Changes

- 7cb48e9: Migrate module augmentation to `Matchers` interface

### Patch Changes

- 26fe3b4: Simplify `ValidationFileMatcher` interface
- Updated dependencies [26fe3b4]
- Updated dependencies [0e0681b]
- Updated dependencies [2a35553]
- Updated dependencies [eff0212]
- Updated dependencies [923b9c2]
- Updated dependencies [77e864a]
  - @cronn/lib-file-snapshots@0.11.0

## 0.9.2

### Patch Changes

- Updated dependencies [3437498]
  - @cronn/lib-file-snapshots@0.10.0

## 0.9.1

### Patch Changes

- Updated dependencies [8bdd71a]
- Updated dependencies [8bdd71a]
  - @cronn/lib-file-snapshots@0.9.0

## 0.9.0

### Minor Changes

- 3c96aa6: Introduce option `namingStrategy` for file matchers
- 3c96aa6: Breaking change: Use `file` as default `namingStrategy`

### Patch Changes

- Updated dependencies [d33e703]
- Updated dependencies [0695b55]
- Updated dependencies [d33e703]
  - @cronn/lib-file-snapshots@0.8.0

## 0.8.2

### Patch Changes

- Updated dependencies [21adc17]
  - @cronn/lib-file-snapshots@0.7.0

## 0.8.1

### Patch Changes

- eef105b: Update `lib-file-snapshots`
- Updated dependencies [3e556d6]
  - @cronn/lib-file-snapshots@0.6.0

## 0.8.0

### Minor Changes

- 69c981c: Enable definition of custom normalizers for `toMatchTextFile` and `toMatchJsonFile`

### Patch Changes

- Updated dependencies [a456239]
  - @cronn/lib-file-snapshots@0.5.0

## 0.7.0

### Minor Changes

- 082aa27: Breaking change: Replaced `toMatchValidationFile` by file-based matchers `toMatchJsonFile` and `toMatchTextFile`.

### Patch Changes

- b3f93ce: Change repo URLs after rename
- Updated dependencies [8dd1d95]
- Updated dependencies [b3f93ce]
- Updated dependencies [082aa27]
  - @cronn/lib-file-snapshots@0.4.0

## 0.6.0

### Minor Changes

- 3e39407: Breaking change: Rename `fileSuffix` option to `name` and remove deprecated `suffix` option
- f73c90b: Breaking change: Move baseDir handling to vitest-file-snapshots and rename parameter to testDir
- 1e72608: Breaking change: Remove test extension from test path

### Patch Changes

- 7ac4e8d: chore(deps): bump the vitest group with 3 updates
- 1dadd57: refactor: Extract message to lib-file-snapshots
- 2977b53: Rename validation file matcher options for clarity
- Updated dependencies [7ac4e8d]
- Updated dependencies [1dadd57]
- Updated dependencies [f73c90b]
- Updated dependencies [2977b53]
  - @cronn/lib-file-snapshots@0.3.0

## 0.5.0

### Minor Changes

- 6e55368: Deprecate suffix in favor of fileSuffix

### Patch Changes

- 4fc3c09: Generalize serializers and extract validation file matcher
- a2a8534: chore(deps): bump @types/node from 22.15.21 to 22.15.29
- Updated dependencies [4fc3c09]
- Updated dependencies [a2a8534]
  - @cronn/lib-file-snapshots@0.2.0

## 0.4.2

### Patch Changes

- 25931bc: Update dependencies
- 12d4a0b: Extract core library to @cronn/lib-file-snapshots
- Updated dependencies [25931bc]
- Updated dependencies [12d4a0b]
  - @cronn/lib-file-snapshots@0.1.0

## 0.4.1

### Patch Changes

- f9541a3: Update dependencies

## 0.4.0

### Minor Changes

- 8864f93: Enable configuration of snapshot directories.

  This is a breaking change. Before, the base directory for snapshot files was `src`, now it is the root directory. This allows using the matcher in projects where tests are located in a different directory.
  The validation file matcher must now be setup using the following snippet:

  ```ts
  import { registerValidationFileMatcher } from "@cronn/vitest-file-snapshots/matcher";

  registerValidationFileMatcher();
  ```

  To achieve the previous behavior, the following configuration can be used:

  ```ts
  import { registerValidationFileMatcher } from "@cronn/vitest-file-snapshots/matcher";

  registerValidationFileMatcher({
    baseDir: "src",
  });
  ```

## 0.3.2

### Patch Changes

- 8152882: Fix path in README

## 0.3.1

### Patch Changes

- e7975cc: Fix example in README

## 0.3.0

### Minor Changes

- 94c5937: - Normalize file suffix
  - Fix module augmentation in declaration file

## 0.2.0

### Minor Changes

- 5ad7bb0: Improve test name normalization

## 0.1.0

### Minor Changes

- 6dd1b10: Initial release
