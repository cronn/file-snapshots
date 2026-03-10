# General-Purpose Snapshots

The function `snapshotElement` provides a general-purpose snapshot including all supported roles and attributes. It can be used to achieve a high test coverage, but can become hard to read for complex HTML structures.

```ts
import { snapshotElement } from "@cronn/element-snapshot";
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();

test("matches element snapshot", async ({ page }) => {
  await expect(snapshotElement(page.getByRole("main"))).toMatchJsonFile();
});
```

Element Snapshot Example:

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

To improve the specificity of certain tests, `snapshotElement` can be called on certain areas of the page only:

```ts
test("matches navigation snapshot", async ({ page }) => {
  await expect(snapshotElement(page.getByRole("navigation"))).toMatchJsonFile({
    name: "navigation",
  });
});
```

## Snapshot Options

Snapshot options can be passed when calling the snapshot function:

```ts
await expect(
  snapshotElement(page.getByLabel("My select"), {
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
