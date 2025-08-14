import { expect, test } from "vitest";

import { isString } from "../utils/guards";
import { type SerializerTestFn, testSerializer } from "../utils/test";

import {
  type JsonNormalizerContext,
  JsonSerializer,
  type JsonSerializerOptions,
} from "./json-serializer";

function jsonSerializerTest(
  value: unknown,
  options?: JsonSerializerOptions,
): SerializerTestFn {
  return testSerializer(new JsonSerializer(options), value);
}

test("undefined", jsonSerializerTest(undefined));
test("null", jsonSerializerTest(null));
test("boolean", jsonSerializerTest(true));
test("number", jsonSerializerTest(4711));
test("string", jsonSerializerTest("first line\nsecond line"));

test("Number.NaN", jsonSerializerTest(Number.NaN));
test("Number.MIN_VALUE", jsonSerializerTest(Number.MIN_VALUE));
test("Number.MAX_VALUE", jsonSerializerTest(Number.MAX_VALUE));
test("Number.MIN_SAFE_INTEGER", jsonSerializerTest(Number.MIN_SAFE_INTEGER));
test("Number.MAX_SAFE_INTEGER", jsonSerializerTest(Number.MAX_SAFE_INTEGER));
test("Number.NEGATIVE_INFINITY", jsonSerializerTest(Number.NEGATIVE_INFINITY));
test("Number.POSITIVE_INFINITY", jsonSerializerTest(Number.POSITIVE_INFINITY));

test("BigInt", jsonSerializerTest(BigInt(1)));

test("Symbol", jsonSerializerTest(Symbol("description")));

test("Date", jsonSerializerTest(new Date("2000-01-01T12:34:56Z")));
test("invalid Date", jsonSerializerTest(new Date("invalid")));

test("Promise", jsonSerializerTest(Promise.resolve("async value")));

test(
  "object",
  jsonSerializerTest({
    stringValue: "value",
    booleanValue: true,
    numberValue: 4711,
    nullValue: null,
    undefinedValue: undefined,
    arrayValue: ["item1", "item2"],
    objectValue: {
      key: "value",
    },
  }),
);
test(
  "object with included undefined properties",
  jsonSerializerTest({
    undefinedValue: undefined,
  }),
);

test(
  "array",
  jsonSerializerTest([
    "value",
    true,
    4711,
    null,
    undefined,
    ["item1", "item2"],
    {
      key: "value",
    },
  ]),
);

test("Set", jsonSerializerTest(new Set(["item1", "item2"])));

test(
  "Map",
  jsonSerializerTest(
    new Map([
      ["key1", "item1"],
      ["key2", "item2"],
    ]),
  ),
);

test(
  "function",
  jsonSerializerTest(function functionName(): string {
    return "value";
  }),
);

test(
  "arrow function",
  jsonSerializerTest((): string => {
    return "value";
  }),
);

test(
  "custom normalizers",
  jsonSerializerTest(
    {
      number: 4711,
      array: ["item 1", "item 2"],
      object: {
        key: "value",
      },
      comment: "comment",
    },
    {
      normalizers: [removeCommentProperty, prefixWithContext, maskNumber],
    },
  ),
);

function removeCommentProperty(value: unknown): unknown {
  if (typeof value === "object" && value !== null && "comment" in value) {
    return { ...value, comment: undefined };
  }

  return value;
}

function maskNumber(value: unknown): unknown {
  if (typeof value === "number") {
    return "[NUMBER]";
  }

  return value;
}

function prefixWithContext(
  value: unknown,
  context: JsonNormalizerContext,
): unknown {
  if (isString(value) && context.index !== undefined) {
    return `${context.index}:${value}`;
  }

  if (isString(value) && context.key !== undefined) {
    return `${context.key}:${value}`;
  }

  return value;
}

test(
  "custom indentSize",
  jsonSerializerTest({ key: "value" }, { indentSize: 4 }),
);

test("when indentSize is no positive integer, throws error", () => {
  expect(() => new JsonSerializer({ indentSize: 0 })).toThrowError();
});
