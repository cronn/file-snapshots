# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

Monorepo providing **file snapshot testing** integrations for several JS test frameworks. Published as `@cronn/*` packages. Snapshots are stored as separate files on disk (not inline), with a "validation file" (committed expected output) and an "output file" (regenerated each run) per assertion.

## Tooling

- Node.js and pnpm (declared via `devEngines`, auto-downloaded)
- pnpm workspace + Turborepo
- `tsgo` (`@typescript/native-preview`) — type checking
- `tsdown` — library bundler (produces `dist/`)
- `oxfmt` — formatter (config in `oxfmt.config.ts`)
- `eslint` — linter
- `knip` — dead-code / unused dep detection
- `@pnpm/meta-updater` (config in `.meta-updater/main.mjs`, logic in `packages/meta-updater`) — keeps every `package.json` in the workspace in sync. Run `pnpm config:fix` after editing any `package.json` so generated fields stay consistent.
- `changesets` — versioning / release
- `vitest` — unit tests (located in `<package>/src/__tests__`)
- `@playwright/test` — integration tests for Playwright-based packages (located in `<package>/tests`)

## Common commands

Top-level (run from repo root):

| Command            | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| `pnpm turbo check` | All checks: type-check, lint, format, knip, meta-updater, test |
| `pnpm turbo fix`   | Auto-fix lint, format, knip, meta-updater                      |
| `pnpm turbo build` | Build all publishable packages (via `tsdown`)                  |
| `pnpm turbo ci`    | What CI runs: `check` + `build`                                |
| `pnpm turbo clean` | Remove `dist/`, `.turbo`, coverage, etc.                       |

Scope to one package with `--filter`:

```sh
pnpm turbo --filter=@cronn/playwright-file-snapshots check
pnpm turbo --filter=@cronn/lib-file-snapshots test
```

Run a single test file (inside a package dir):

```sh
# vitest
pnpm vitest run src/__tests__/json-serializer.test.ts
pnpm vitest run -t "matches a snapshot"   # by test name

# playwright (from packages/playwright-file-snapshots or packages/element-snapshot)
pnpm playwright test tests/json-file-matcher.spec.ts
pnpm playwright test --grep "@update-changed"
```

The Playwright and Vitest integration suites have **update-mode variants** because they test the snapshot-update behavior itself. Use the package's dedicated scripts rather than passing `--update` flags by hand — e.g. `pnpm run test:integration:update-changed` in `playwright-file-snapshots`, `pnpm run test:update-new` in `vitest-file-snapshots`. The default `test:integration:core` / `test:core` runs everything _except_ those tagged variants.

## Package graph

```
lib-file-snapshots                 ← framework-agnostic core (matcher, serializers, normalizers)
   ├── playwright-file-snapshots   ← Playwright matchers (defineFileSnapshotMatchers)
   │     └── element-snapshot      ← DOM → JSON snapshots for Playwright (defineElementSnapshotMatchers)
   │     └── aria-snapshot         ← ARIA tree → JSON snapshots for Playwright (defineAriaSnapshotMatchers)
   ├── vitest-file-snapshots       ← Vitest matchers (registerFileSnapshotMatchers)

shared-configs   ← tsdown/vitest/eslint/playwright config presets (workspace-internal)
test-utils       ← fixtures and utils used in tests (workspace-internal)
meta-updater     ← package.json sync logic (workspace-internal)
docs             ← VitePress site (cronn.github.io/file-snapshots)
```

`shared-configs`, `test-utils`, `meta-updater`, `docs` are `private: true` and not published.

## Conventions

- Use Conventional Commits. When a change is related to a package, use the package name (without `@cronn/`) as the scope, e.g. `feat(playwright-file-snapshots): <description>`
- Use `kebab-case` for directory and file names
- Use `UPPER_CASE` for naming top-level constants

## Architecture notes

- The published surface of `lib-file-snapshots` is `src/index.ts`. All cross-package public types/values flow through it; the framework packages re-export the user-facing pieces from there (see `playwright-file-snapshots/src/index.ts` and `vitest-file-snapshots/src/index.ts`).
- `ValidationFileMatcher` (`packages/lib-file-snapshots/src/matcher/validation-file-matcher.ts`) is the core engine. It takes a `SnapshotSerializer<T>` (JSON / text / Markdown table) plus an `updateSnapshots` mode (`"all" | "missing" | "none") and decides whether to write or compare.
- Serializers live in `lib-file-snapshots/src/serializers`; normalizers (string, mask-pattern, mask-string) live in `src/normalizers` and are how callers normalize unstable data (timestamps, IDs, …) before comparison.
- Framework adapters' job is twofold: (1) translate test-runner state (test name, project root) into the `FilePathResolver` config that `ValidationFileMatcher` expects, and (2) wire the matcher's `pass`/`message` result into the host runner's assertion API.
- TS config (`tsconfig.base.json`) sets `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `erasableSyntaxOnly`, `noEmit`. `erasableSyntaxOnly` rules out enums, namespaces, parameter-property constructors, etc. — use plain types / unions instead.
- Output goes to `data/test/output` (gitignored); committed expected files live alongside under `data/test/` (the path each package uses is documented in its README).

## Documentation

- The documentation is located in `packages/docs`
- Documentation is separated by testing framework: `src/playwright` and `src/vitest`
- Documentation of core features implemented in `lib-file-snapshots` is located in `src/general`
- Documentation of the `element-snapshot` package is located in `src/playwright/element-snapshots`
- Documentation of the `aria-snapshot` package is located in `src/playwright/aria-snapshots.md`

## When editing

- Touching any `package.json` field that meta-updater owns? Run `pnpm turbo fix` and commit the result.
- Adding a user-visible change to a published package? Run `pnpm changeset add` to add a changeset entry — releases are driven by `.changeset/` files, not by hand-edited `CHANGELOG.md`.
- Imports are auto-sorted by `oxfmt` into groups (`type-import`/builtin/external → `@cronn/*` workspace → internal → parent → sibling). Don't fight the formatter; `pnpm turbo fix` reorders them.
