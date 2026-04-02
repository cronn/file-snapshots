# Semantic Snapshots

The function `semanticSnapshot` provides a general-purpose snapshot covering the semantic structure of the target element. It includes all supported roles and attributes, providing a high test coverage. The format is optimized to be human-readable, but large and complex HTML structures will result in complex snapshots as well.

```ts
import { semanticSnapshot } from "@cronn/element-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

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

  await expect(semanticSnapshot(page.getByRole("list"))).toMatchJsonFile();
});
```

**Output (`matches_semantic_snapshot.json`):**

```json
{
  "main": [
    {
      "heading": {
        "name": "List",
        "level": 1
      }
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

To improve the specificity of certain tests, `semanticSnapshot` can be called on certain areas of the page only:

```ts
test("matches navigation snapshot", async ({ page }) => {
  await expect(semanticSnapshot(page.getByRole("navigation"))).toMatchJsonFile({
    name: "navigation",
  });
});
```

## Snapshot Options

Snapshot options can be passed when calling the snapshot function:

```ts
await expect(
  semanticSnapshot(page.getByLabel("My select"), {
    filter: (element) => element.role === "heading",
  }),
).toMatchJsonFile({
  name: "headings",
});
```

| Option                   | Default Value | Description                                                                                                                                                                                                                   |
| ------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filter`                 | `() => true`  | Include only elements in the snapshot for which the specified filter returns `true`.                                                                                                                                          |
| `recurseFilter`          | `false`       | Recursively apply specified filter to children of filtered elements. By default, recursion ends when the filter returns `true` for an element. Should be `true` for filters intended to remove specific elements recursively. |
| `includeComboboxOptions` | `false`       | Include combobox options in the snapshot.                                                                                                                                                                                     |
