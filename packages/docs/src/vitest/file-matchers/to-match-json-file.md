# toMatchJsonFile

Asserts that a value matches a JSON file snapshot. The value is serialized to JSON and compared to a stored validation file.

## Usage

```ts
test("value is expected value", () => {
  expect({ value: "expected value" }).toMatchJsonFile();
});
```

**Output (`value_is_expected_value.json`):**

```json
{
  "value": "expected value"
}
```

## `undefined` Object Properties

By default, object properties with an `undefined` value are omitted from the snapshot. Set `includeUndefinedObjectProperties` to `true` to include them:

```ts
test("includes undefined properties", () => {
  expect({ name: "Alice", age: undefined }).toMatchJsonFile({
    includeUndefinedObjectProperties: true,
  });
});
```

**Output (`includes_undefined_properties.json`):**

```json
{
  "name": "Alice",
  "age": {
    "$type": "undefined"
  }
}
```

## Options

| Option                             | Default Value       | Description                                                                                                                                                         |
| ---------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`             | Serializes `undefined` properties in objects. By default, they are omitted.                                                                                         |
| `name`                             | `undefined`         | Unique name of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. See [Named Snapshots](/vitest/writing-tests#named-snapshots). |
| `normalizers`                      | `[]`                | Custom normalizers to apply before serialization. See [Normalization of Snapshots](/vitest/writing-tests#normalization-of-snapshots).                               |
| `resolveFilePath`                  | `resolveNameAsFile` | Custom resolver for the file path used to store snapshots.                                                                                                          |
