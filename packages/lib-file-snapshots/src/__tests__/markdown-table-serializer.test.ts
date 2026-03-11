import { expect, test } from "vitest";

import type { TableData } from "../models/table";
import type { MarkdownTableSerializerOptions } from "../serializers/markdown-table-serializer";
import { MarkdownTableSerializer } from "../serializers/markdown-table-serializer";
import { type SerializerTestFn, testSerializer } from "../utils/test";

function markdownTableSerializerTest(
  value: TableData,
  options?: MarkdownTableSerializerOptions,
): SerializerTestFn {
  return testSerializer(new MarkdownTableSerializer(options), value);
}

test(
  "serializes full table data",
  markdownTableSerializerTest({
    columns: ["name", "city"],
    rows: [
      ["Alice", "New York"],
      ["Bob", "London"],
    ],
  }),
);

test(
  "serializes single row with columns",
  markdownTableSerializerTest({
    columns: ["name", "age"],
    rows: [["Alice", 30]],
  }),
);

test(
  "serializes empty rows with columns",
  markdownTableSerializerTest({ columns: ["name", "age"], rows: [] }),
);

test("when columns are empty, throws error", () =>
  expect(() =>
    new MarkdownTableSerializer().serialize({ columns: [], rows: [] }),
  ));

test(
  "serializes number values as string",
  markdownTableSerializerTest({
    columns: ["value"],
    rows: [-1, 0, 1.5].map((value) => [value]),
  }),
);

test(
  "serializes boolean values as string",
  markdownTableSerializerTest({
    columns: ["value"],
    rows: [true, false].map((value) => [value]),
  }),
);

test(
  "serializes nullable values as string",
  markdownTableSerializerTest({
    columns: ["value"],
    rows: [null, undefined].map((value) => [value]),
  }),
);

test(
  "applies single normalizer",
  markdownTableSerializerTest(
    {
      columns: ["normalized value"],
      rows: [["hello"], ["world"]],
    },
    {
      normalizers: [(v) => (typeof v === "string" ? v.toUpperCase() : v)],
    },
  ),
);

test(
  "applies multiple normalizers in order",
  markdownTableSerializerTest(
    { columns: ["normalized value"], rows: [["value"]] },
    {
      normalizers: [
        (v) => (typeof v === "string" ? v.toUpperCase() : v),
        (v) => (typeof v === "string" ? `[${v}]` : v),
      ],
    },
  ),
);
