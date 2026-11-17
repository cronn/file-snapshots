---
"@cronn/element-snapshot": minor
---

**Breaking change**: Options of `combobox` elements are no longer collected in the `options` attribute, but snapshotted as children. Options of a listbox referenced via `aria-controls` are part of the snapshot of the listbox itself.

Removed `comboboxTransformer`, since there are no options left to include or exclude.

To exclude the options of comboboxes as before, register a transformer omitting the children:

```ts
await expect(page.getByRole("main")).toMatchSemanticSnapshotFile({
  transformers: {
    combobox: (snapshot, { transform }) =>
      transform({ ...snapshot, children: [] }),
  },
});
```
