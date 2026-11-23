# File Snapshots Core Library

The framework-agnostic core for testing with file snapshots.

[Read the full documentation](https://cronn.github.io/file-snapshots/)

This package contains the shared implementation of the framework integrations, e.g. snapshot serialization, normalizers and file path resolvers. To write tests with file snapshots, use one of the integrations instead:

- [`@cronn/playwright-file-snapshots`](https://www.npmjs.com/package/@cronn/playwright-file-snapshots) — file snapshots for Playwright
- [`@cronn/vitest-file-snapshots`](https://www.npmjs.com/package/@cronn/vitest-file-snapshots) — file snapshots for Vitest

The public utilities of this package are re-exported by the integrations and documented here:

- [Normalizers](https://cronn.github.io/file-snapshots/general/normalizers) — mask non-deterministic values in snapshots
- [File Path Resolvers](https://cronn.github.io/file-snapshots/general/file-path-resolvers) — customize where snapshots are stored
