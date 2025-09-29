import { test } from "vitest";

import { testSerializer, testSerializerThrows } from "../utils/test";

import { TextSerializer } from "./text-serializer";

test("text", testSerializer(new TextSerializer(), "value"));

test(
  "text with control characters",
  testSerializer(
    new TextSerializer(),
    "first line\nsecond line\n\ttabbed line",
  ),
);

test(
  "text with leading and trailing whitespaces",
  testSerializer(new TextSerializer(), " value "),
);

test(
  "custom normalizers",
  testSerializer(
    new TextSerializer({ normalizers: [maskNumber, removeComment] }),
    "4711 comment",
  ),
);

test(
  "when value is not of type string, throws error",
  testSerializerThrows(new TextSerializer(), ["value"]),
);

function maskNumber(value: string): string {
  return value.replaceAll(/\d+/g, "[NUMBER]");
}

function removeComment(value: string): string {
  return value.replaceAll(/comment/g, "");
}

test(
  "custom file extension",
  testSerializer(new TextSerializer({ fileExtension: "md" }), "# Heading"),
);
