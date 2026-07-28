# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

Monorepo providing **file snapshot testing** integrations for several JS test frameworks. Published as `@cronn/*` packages. Snapshots are stored as separate files on disk (not inline), with a "validation file" (committed expected output) and an "output file" (regenerated each run) per assertion.

## Tooling

- Always use Turborepo to run tasks including dependencies
- `@pnpm/meta-updater` (config in `.meta-updater/main.mjs`, logic in `packages/meta-updater`) — keeps every `package.json` in the workspace in sync

## Tests

The Playwright and Vitest integration suites have **update-mode variants** because they test the snapshot-update behavior itself. Use the package's dedicated scripts rather than passing `--update` flags by hand — e.g. `pnpm turbo test:integration:update-changed` in `playwright-file-snapshots`, `pnpm turbo test:update-new` in `vitest-file-snapshots`. The default `test:integration:core` / `test:core` runs everything _except_ those tagged variants.

## Conventions

- Use Conventional Commits. When a change is related to a package, use the package name (without `@cronn/`) as the scope, e.g. `feat(playwright-file-snapshots): <description>`
- Use `kebab-case` for directory and file names
- Use `UPPER_CASE` for naming top-level constants

## Before committing

- Run `pnpm turbo fix`
- Adding a user-visible change to a published package? Run `pnpm changeset add` to add a changeset entry

## GitHub Pull Requests

- Self-assign the PR
- Add labels for each package affected by changes. Use the package name as label.
- Provide a short summary of the introduced changes. Focus on essential changes.
