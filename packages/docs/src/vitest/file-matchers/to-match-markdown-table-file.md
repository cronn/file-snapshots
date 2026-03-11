# toMatchMarkdownTableFile

Asserts that tabular data matches a Markdown file snapshot. The value is serialized to a Markdown table and compared to a stored validation file.

## Usage

### Array-Based Rows

Use `Table.define` to define the actual Markdown table:

```ts
import { Table } from "@cronn/vitest-file-snapshots";

test("matches Markdown table", () => {
  expect(
    Table.define({
      columns: ["input", "output"],
      rows: [
        ["input 1", "output 1"],
        ["input 2", "output 2"],
      ],
    }),
  ).toMatchMarkdownTableFile();
});
```

**Output (`matches_Markdown_table.md`):**

```md
| input   | output   |
| ------- | -------- |
| input 1 | output 1 |
| input 2 | output 2 |
```

### Record-Based Rows

Use `Table.fromRecords` to define the actual Markdown table by an array of records:

```ts
import { Table } from "@cronn/vitest-file-snapshots";

test("matches Markdown table from records", () => {
  expect(
    Table.fromRecords([
      { input: "input 1", output: "output 1" },
      { input: "input 2", output: "output 2" },
    ]),
  ).toMatchMarkdownTableFile();
});
```

**Output (`matches_Markdown_table_from_records.md`):**

```md
| input   | output   |
| ------- | -------- |
| input 1 | output 1 |
| input 2 | output 2 |
```

The columns are derived from the keys while the rows are derived from the values.

## Options

| Option            | Default Value       | Description                                                                                                                                                         |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | `undefined`         | Unique name of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. See [Named Snapshots](/vitest/writing-tests#named-snapshots). |
| `normalizers`     | `[]`                | Custom normalizers to apply before serialization. See [Normalization of Snapshots](/vitest/writing-tests#normalization-of-snapshots).                               |
| `resolveFilePath` | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                                                                                          |
