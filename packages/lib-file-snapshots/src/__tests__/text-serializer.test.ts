import { test } from "vitest";

import { TextSerializer } from "../serializers/text-serializer";
import { testSerializer } from "../utils/test";

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
