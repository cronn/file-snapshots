# toMatchTextFile

Asserts that a string value matches a text file snapshot. The string is trimmed and compared to a stored validation file. Supports retries when a callback function is provided as the actual value.

## Usage

### Static Snapshot

```ts
test("matches page title", async () => {
  await page.setContent("<title>Page Title</title>");

  await expect(page.title()).toMatchTextFile();
});
```

**Output (`matches_page_title.txt`):**

```
Page Title
```

### Repeatable Snapshot

When passing a callback function as actual value, the snapshot will be [retried](/playwright/writing-tests#snapshot-retries) until it matches the stored validation file:

```ts
test("matches page title eventually", async () => {
  await page.setContent("<title>Page Title</title>");

  await expect(() => page.title()).toMatchTextFile();
});
```

## Custom File Extension

Use `fileExtension` to store snapshots with a different file extension:

```ts
test("matches HTML snapshot", async ({ page }) => {
  await page.setContent("<main>Hello World</main>");

  await expect(() => page.getByRole("main").innerHTML()).toMatchTextFile({
    fileExtension: "html",
  });
});
```

**Output (`matches_HTML_snapshot.html`):**

```html
<main>Hello World</main>
```

## Options

| Option            | Default Value                                               | Description                                                                                                                                                                 |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fileExtension`   | `txt`                                                       | File extension used for storing the snapshot file.                                                                                                                          |
| `name`            | `undefined`                                                 | Unique name of the file snapshot. Used to distinguish multiple file snapshots within the same `test`. See [Named Snapshots](/playwright/writing-tests#named-snapshots).     |
| `normalizers`     | `[]`                                                        | Custom normalizers to apply before serialization. See [Normalization of Snapshots](/playwright/writing-tests#normalization-of-snapshots).                                   |
| `timeout`         | [expect timeout](https://playwright.dev/docs/test-timeouts) | Retries the snapshot until it passes or the timeout is reached. Only applies when a callback is passed. See [Snapshot Retries](/playwright/writing-tests#snapshot-retries). |
| `updateDelay`     | `250`                                                       | Delay in ms before a repeatable snapshot is created in update mode. See [Snapshot Retries](/playwright/writing-tests#snapshot-retries).                                     |
| `resolveFilePath` | `resolveNameAsFile`                                         | Custom resolver for the file path used to store snapshots. See [Named Snapshots](/playwright/writing-tests#named-snapshots).                                                |
