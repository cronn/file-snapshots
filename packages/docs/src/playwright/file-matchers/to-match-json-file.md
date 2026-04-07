# toMatchJsonFile

Asserts that a value matches a JSON file snapshot. The value is serialized to JSON and compared to a stored validation file. Supports retries when a callback function is provided as the actual value.

## Usage

### Static Snapshot

```ts
test("matches page title ultimately", async () => {
  await page.setContent("<title>Page Title</title>");

  await expect({
    title: await page.title(),
  }).toMatchJsonFile();
});
```

**Output (`matches_page_title.json`):**

```json
{
  "title": "Page Title"
}
```

### Repeatable Snapshot

When passing a callback function as actual value, the snapshot will be [retried](/playwright/writing-tests#snapshot-retries) until it matches the stored validation file:

```ts
test("matches page title eventually", async () => {
  await page.setContent("<title>Page Title</title>");

  await expect(async () => ({
    title: await page.title(),
  })).toMatchJsonFile();
});
```

## `undefined` Object Properties

By default, object properties with an `undefined` value are omitted from the snapshot. Set `includeUndefinedObjectProperties` to `true` to include them:

```ts
test("includes undefined properties", async () => {
  await expect({ name: "Alice", age: undefined }).toMatchJsonFile({
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

| Option                             | Default Value                                               | Description                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `includeUndefinedObjectProperties` | `false`                                                     | Serializes `undefined` properties in objects. By default, they are omitted.                                                                                                 |
| `name`                             | `undefined`                                                 | Unique name of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. See [Named Snapshots](/playwright/writing-tests#named-snapshots).     |
| `normalizers`                      | `[]`                                                        | Custom normalizers to apply before serialization. See [Normalization of Snapshots](/playwright/writing-tests#normalization-of-snapshots).                                   |
| `timeout`                          | [expect timeout](https://playwright.dev/docs/test-timeouts) | Retries the snapshot until it passes or the timeout is reached. Only applies when a callback is passed. See [Snapshot Retries](/playwright/writing-tests#snapshot-retries). |
| `updateDelay`                      | `250`                                                       | Delay in ms before a repeatable snapshot is created in update mode. See See [Snapshot Retries](/playwright/writing-tests#snapshot-retries).                                 |
| `resolveFilePath`                  | `resolveNameAsFile`                                         | Custom resolver for the file path used to store snapshots. See [Named Snapshots](/playwright/writing-tests#named-snapshots).                                                |
