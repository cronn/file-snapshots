# Element Snapshots

Element Snapshots are a custom snapshot implementation inspired by [Playwright's ARIA Snapshots](https://playwright.dev/docs/aria-snapshots#aria-snapshots) and the [Accessibility Object Model](https://wicg.github.io/aom/explainer.html). They cover additional properties, e.g. validation attributes like `required` or `invalid` on form inputs, and are optimized to be serialized as JSON.

Element Snapshots are designed to be used in combination with [playwright-file-snapshots](/playwright/) for writing Playwright tests.

::: warning Experimental
Element Snapshots are currently experimental. Not all HTML elements, ARIA roles and attributes are covered. Breaking changes to the snapshot format are possible.
:::

## Installation

::: code-group

```shell [pnpm]
pnpm add -D @cronn/element-snapshot
```

```shell [npm]
npm install -D @cronn/element-snapshot
```

```shell [yarn]
yarn add -D @cronn/element-snapshot
```

:::
