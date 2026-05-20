# Normalizers

The following normalizer functions can be used to mask non-deterministic or irrelevant values in file snapshots, e.g. timestamps, IDs or URLs. They are defined in the `@cronn/lib-file-snapshots` package. For convenience, they are also re-exported from the [`@cronn/playwright-file-snapshots`](/playwright/) and [`@cronn/vitest-file-snapshots`](/vitest/) packages.

## `maskString`

Returns a normalizer that replaces every occurrence of `searchValue` with `maskedValue`.

```ts
import { maskString } from "@cronn/lib-file-snapshots";

test("masks base URL", async () => {
  await expect(`
    - [Home](https://example.com/home)
    - [About Us](https://example.com/about)
    - [Blog](https://example.com/blog)
  `).toMatchTextFile({
    normalizers: [maskString("https://example.com", "<BASE_URL>")],
    fileExtension: "md",
  });
});
```

**Output:**

```md [masks_base_URL.md]
- [Home](<BASE_URL>/home)
- [About Us](<BASE_URL>/about)
- [Blog](<BASE_URL>/blog)
```

## `maskPattern`

Returns a normalizer that finds every distinct match of `searchPattern` and replaces it with `maskValue(index)`, where `index` increments for each new distinct match. Repeated matches reuse the same index, which makes the mask stable within the same snapshot.

> [!NOTE]
> The regular expression must include the global flag (`g`) so all matches are detected.

```ts
import { maskPattern } from "@cronn/lib-file-snapshots";

const TIMESTAMP_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g;

test("masks distinct timestamps", async () => {
  await expect(`
    2026-05-21T08:00:01Z Application started successfully
    2026-05-21T08:03:23Z User login successful
    2026-05-21T08:05:46Z Payment failed
  `).toMatchTextFile({
    normalizers: [
      maskPattern(TIMESTAMP_REGEX, (index) => `<TIMESTAMP_${index}>`),
    ],
  });
});
```

**Output:**

```[masks_distinct_timestamps.txt]
<TIMESTAMP_0> Application started successfully
<TIMESTAMP_1> User login successful
<TIMESTAMP_2> Payment failed
```

## `stringNormalizer`

Normalizers passed to a JSON or Markdown Table snapshot may receive values of a type different from `string`. `stringNormalizer` adapts a string-based normalizer (e.g. [`maskString`](#mask-string) or [`maskPattern`](#mask-pattern)) so it can be used as a guarded normalizer: the wrapped normalizer is applied to string values only, and any other value is returned unchanged.

```ts
import { maskPattern, stringNormalizer } from "@cronn/lib-file-snapshots";

const TIMESTAMP_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g;

test("masks distinct timestamps in JSON", async () => {
  await expect([
    {
      timestamp: "2026-05-21T08:00:01Z",
      message: "Application started successfully",
    },
    {
      timestamp: "2026-05-21T08:03:23Z",
      message: "User login successful",
    },
    {
      timestamp: "2026-05-21T08:05:46Z",
      message: "Payment failed",
    },
  ]).toMatchJsonFile({
    normalizers: [
      stringNormalizer(
        maskPattern(TIMESTAMP_REGEX, (counter) => `<TIMESTAMP_${counter}>`),
      ),
    ],
  });
});
```

**Output:**

```json [masks_distinct_timestamps_in_JSON.json]
[
  {
    "timestamp": "<TIMESTAMP_0>",
    "message": "Application started successfully"
  },
  {
    "timestamp": "<TIMESTAMP_1>",
    "message": "User login successful"
  },
  {
    "timestamp": "<TIMESTAMP_2>",
    "message": "Payment failed"
  }
]
```
