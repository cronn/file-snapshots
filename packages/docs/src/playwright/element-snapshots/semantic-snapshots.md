# Semantic Snapshots

The `toMatchSemanticSnapshotFile` matcher provides a general-purpose snapshot covering the semantic structure of the target element. It includes all supported roles and attributes, providing a high test coverage. The format is optimized to be human-readable, but large and complex HTML structures will result in complex snapshots as well.

```ts
import { defineElementSnapshotMatchers } from "@cronn/element-snapshot";

const expect = defineElementSnapshotMatchers();

test("matches semantic snapshot", async ({ page }) => {
  await page.setContent(`
    <main>
      <h1>List</h1>
      <ul>
        <li>Apple</li>
        <li>Peach</li>
      </ul>
    </main>
  `);

  await expect(page.getByRole("main")).toMatchSemanticSnapshotFile();
});
```

**Output:**

```json [matches_semantic_snapshot.json]
{
  "main": [
    {
      "heading": "List",
      "level": 1
    },
    {
      "list": [
        {
          "listitem": "Apple"
        },
        {
          "listitem": "Peach"
        }
      ]
    }
  ]
}
```

To improve the specificity of certain tests, `toMatchSemanticSnapshotFile` can be called on certain areas of the page only:

```ts
test("matches navigation snapshot", async ({ page }) => {
  await expect(page.getByRole("navigation")).toMatchSemanticSnapshotFile({
    name: "navigation",
  });
});
```

## Snapshot Options

Snapshot options can be passed when calling the snapshot function:

```ts
await expect(page.getByRole("main")).toMatchSemanticSnapshotFile({
  name: "headings",
  filter: (element) => element.role === "heading",
});
```

| Option          | Default Value | Description                                                                                                                                                                                                                   |
| --------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filter`        | `() => true`  | Include only elements in the snapshot for which the specified filter returns `true`.                                                                                                                                          |
| `recurseFilter` | `false`       | Recursively apply specified filter to children of filtered elements. By default, recursion ends when the filter returns `true` for an element. Should be `true` for filters intended to remove specific elements recursively. |
| `transformers`  | see below     | Replace the default transformation for specific roles. See [Transformers](#transformers).                                                                                                                                     |

## Transformers

The default transformation can be replaced per role with `transformers`. A transformer is applied **after** the `filter`, but **before** the default serialization, so it always receives the children that survived the filter. It may return any JSON-serializable value, which is written to the snapshot verbatim.

> [!NOTE]
> Transformers operate on element snapshots and are keyed by role. They are unrelated to the value-masking [normalizers](/general/normalizers) of `@cronn/lib-file-snapshots`, which are also available on `toMatchSemanticSnapshotFile` as the `normalizers` option and applied to the resulting JSON.

```ts
import { getTextContent } from "@cronn/playwright-file-snapshots";

test("transforms list items", async ({ page }) => {
  await page.setContent(`
    <ul>
      <li>Apple</h1>
      <li>Pear</p>
    </main>
  `);

  await expect(page.getByRole("list")).toMatchSemanticSnapshotFile({
    transformers: {
      listitem: (snapshot) => getTextContent(snapshot.children),
    },
  });
});
```

**Output:**

```json [transforms_list_items.json]
{
  "list": ["Apple", "Pear"]
}
```

### Transforming children

The `transform` function of the context parameter applies the default transformation to snapshots the transformer does not handle itself. Transformers registered for descendant roles are still applied, while the transformer of the passed snapshot is skipped, so this can never recurse infinitely.

```ts
await expect(page.getByRole("list")).toMatchSemanticSnapshotFile({
  transformers: {
    list: (snapshot, { transform }) => ({
      items: snapshot.children.map((child) => transform(child)),
    }),
  },
});
```

Pass an inline object literal when re-feeding a modified snapshot to `transform`. A value stored in an explicitly typed variable first is not assignable, because TypeScript only infers an index signature for object literals.

```ts
await expect(page.getByRole("heading")).toMatchSemanticSnapshotFile({
  transformers: {
    heading: (snapshot, { transform }) =>
      transform({ ...snapshot, attributes: {} }),
  },
});
```

### `comboboxTransformer`

Combobox options are excluded by default through the built-in `combobox` transformer. Entries in `transformers` override the built-in transformer for the same role, and an explicit `undefined` disables it.

```ts
import { comboboxTransformer } from "@cronn/element-snapshot";

await expect(page.getByRole("main")).toMatchSemanticSnapshotFile({
  transformers: {
    combobox: comboboxTransformer({ includeOptions: true }),
  },
});
```

## Snapshot Function

The `semanticSnapshot` function provides more flexibility than the `toMatchSemanticSnapshotFile` matcher, because it returns the snapshot result as a JavaScript object instead of directly writing it to a file. This makes it suitable for composing custom assertions:

```ts
import { semanticSnapshot } from "@cronn/element-snapshot";
import { defineFileSnapshotMatchers } from "@cronn/playwright-file-snapshots";

const expect = defineFileSnapshotMatchers();

test("combines semantic snapshot results", async ({ page }) => {
  await page.setContent(`
    <nav>Sidenav</nav>
    <main>Content</main>
  `);

  await expect({
    sidenav: await semanticSnapshot(page.getByRole("navigation")),
    content: await semanticSnapshot(page.getByRole("main")),
  }).toMatchJsonFile();
});
```
