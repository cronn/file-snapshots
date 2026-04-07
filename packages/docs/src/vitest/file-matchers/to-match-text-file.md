# toMatchTextFile

Asserts that a string value matches a text file snapshot. The string is trimmed and compared to a stored validation file.

## Usage

```ts
test("value is expected value", () => {
  expect("expected value").toMatchTextFile();
});
```

**Output (`value_is_expected_value.txt`):**

```
expected value
```

## Custom File Extension

Use `fileExtension` to store snapshots with a different file extension:

```ts
test("html snapshot", () => {
  expect("<main>Hello World</main>").toMatchTextFile({ fileExtension: "html" });
});
```

**Output (`html_snapshot.html`):**

```html
<main>Hello World</main>
```

## Options

| Option            | Default Value       | Description                                                                                                                                                         |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fileExtension`   | `txt`               | File extension used for storing the snapshot file.                                                                                                                  |
| `name`            | `undefined`         | Unique name of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. See [Named Snapshots](/vitest/writing-tests#named-snapshots). |
| `normalizers`     | `[]`                | Custom normalizers to apply before serialization. See [Normalization of Snapshots](/vitest/writing-tests#normalization-of-snapshots).                               |
| `resolveFilePath` | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                                                                                          |
