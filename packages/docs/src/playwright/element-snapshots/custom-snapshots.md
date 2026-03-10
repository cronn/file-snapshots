# Custom Snapshots

The function `snapshotElementRaw` provides the raw element snapshot in a strictly typed structure. This format is not well suited to be read by humans, but can be utilized to derive custom snapshot formats, e.g. for HTML tables.

```ts
import { snapshotElementRaw } from "@cronn/element-snapshot";

test("matches custom snapshot", async ({ page }) => {
  const tableSnapshot = await snapshotElementRaw(page.getByRole("table"));
  const markdownTable = transformToMarkdownTable(tableSnapshot);

  await expect(markdownTable).toMatchTextFile({ fileExtension: "md" });
});

function transformToMarkdownTable(snapshot: Array<NodeSnapshot>): string {
  // transform table snapshot to markdown table
}
```

## Utility Functions for Custom Snapshots

| Function      | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `filter`      | Filters node snapshots based on the provided predicate function. |
| `includeRole` | Includes only elements with the specified role.                  |
| `excludeRole` | Excludes elements with the specified role.                       |
