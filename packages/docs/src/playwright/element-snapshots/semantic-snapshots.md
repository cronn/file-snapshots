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

  await expect(page.getByRole("list")).toMatchSemanticSnapshotFile();
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

| Option                   | Default Value | Description                                                                                                                                                                                                                   |
| ------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filter`                 | `() => true`  | Include only elements in the snapshot for which the specified filter returns `true`.                                                                                                                                          |
| `recurseFilter`          | `false`       | Recursively apply specified filter to children of filtered elements. By default, recursion ends when the filter returns `true` for an element. Should be `true` for filters intended to remove specific elements recursively. |
| `includeComboboxOptions` | `false`       | Include combobox options in the snapshot.                                                                                                                                                                                     |

## Snapshot Function

The `semanticSnapshot` function provides more flexibility than the `toMatchSemanticSnapshotFile` matcher, because it returns the snapshot result as a JavaScript object instead of directly writing it to a file. This makes it suitable for composing custom assertions:

```ts
import { semanticSnapshot } from "@cronn/element-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("combines semantic snapshot results", async ({ page }) => {
  await page.setContent(`
    <nav>Sidenav</nav>
    <main>Content</main>
  `);

  const snapshot = await semanticSnapshot(page.locator("body"));
  await expect({
    sidenav: await semanticSnapshot(page.getByRole("navigation")),
    content: await semanticSnapshot(page.getByRole("main")),
  }).toMatchJsonFile();
});
```
