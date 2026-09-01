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

| Option               | Default Value                 | Description                                                                                                                                                                                                                   |
| -------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filter`             | `() => true`                  | Include only elements in the snapshot for which the specified filter returns `true`.                                                                                                                                          |
| `recurseFilter`      | `false`                       | Recursively apply specified filter to children of filtered elements. By default, recursion ends when the filter returns `true` for an element. Should be `true` for filters intended to remove specific elements recursively. |
| `transformers`       | see below                     | Replace the default transformation for specific roles. See [Role-based Transformers](#role-based-transformers).                                                                                                               |
| `defaultTransformer` | `semanticSnapshotTransformer` | Replace the default transformation for all roles. See [Default Transformer](#default-transformer).                                                                                                                            |

## Role-based Transformers

The default transformation can be replaced per role with `transformers`. A transformer is applied **after** the `filter`, but **before** the default serialization, so it always receives the children that survived the filter. It may return any JSON-serializable value, which is written to the snapshot verbatim. To replace the transformation of all roles at once, use [`defaultTransformer`](#default-transformer) instead.

> [!NOTE]
> Transformers operate on element snapshots and are keyed by role. They are unrelated to the value-masking [normalizers](/general/normalizers) of `@cronn/lib-file-snapshots`, which are also available on `toMatchSemanticSnapshotFile` as the `normalizers` option and applied to the resulting JSON.

```ts
import { getTextContent } from "@cronn/element-snapshot";

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

### Combobox Transformer

Combobox options are excluded by default through the built-in `combobox` transformer. Entries in `transformers` override the built-in transformer for the same role, and an explicit `undefined` disables it.

```ts
import { comboboxTransformer } from "@cronn/element-snapshot";

await expect(page.getByRole("main")).toMatchSemanticSnapshotFile({
  transformers: {
    combobox: comboboxTransformer({ includeOptions: true }),
  },
});
```

## Default Transformer

While `transformers` replace the transformation of individual roles, `defaultTransformer` replaces it for **all** roles. It receives every snapshot for which no role-based transformer is registered, so role-based transformers always take precedence.

```ts
import { getTextContent } from "@cronn/element-snapshot";

test("applies default transformer", async ({ page }) => {
  await page.setContent(`
    <h1>Heading</h1>
    <p>Paragraph</p>
  `);

  await expect(page.locator("body")).toMatchSemanticSnapshotFile({
    defaultTransformer: (snapshot) => getTextContent([snapshot]),
  });
});
```

**Output:**

```json [applies_default_transformer.json]
["Heading", "Paragraph"]
```

The default transformer replaces the default transformation entirely, including the serialization of roles, names and attributes. Because the built-in transformation is no longer applied anywhere, a transformer that should cover nested structures has to recurse itself through the `transform` function of its context. Unlike in a role-based transformer, `transform` does not fall back to the built-in serialization: it re-enters the same transformation pipeline, applying role-based transformers first and the default transformer for everything else.

```ts
test("applies default transformer to descendants", async ({ page }) => {
  await page.setContent(`
    <ul>
      <li>
        Fruits
        <ul>
          <li>Apple</li>
          <li>Pear</li>
        </ul>
      </li>
    </ul>
  `);

  await expect(page.locator("body")).toMatchSemanticSnapshotFile({
    defaultTransformer: (snapshot, { transform }) => {
      if ("children" in snapshot && snapshot.children.length > 0) {
        return { [snapshot.role]: snapshot.children.map(transform) };
      }

      return { [snapshot.role]: snapshot.name };
    },
  });
});
```

**Output:**

```json [applies_default_transformer_to_descendants.json]
{
  "list": [
    {
      "listitem": [
        { "text": "Fruits" },
        {
          "list": [
            { "listitem": [{ "text": "Apple" }] },
            { "listitem": [{ "text": "Pear" }] }
          ]
        }
      ]
    }
  ]
}
```

> [!NOTE]
> The `transform` function passed to a role-based transformer delegates to the default transformer as well. A custom `defaultTransformer` therefore also changes the serialization of children delegated by role-based transformers, including the built-in `combobox` transformer.

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
