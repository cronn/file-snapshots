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
  "applies normalizers in order",
  testSerializer(
    new TextSerializer({
      normalizers: [
        (value) => value.replace("v1", "v2"),
        (value) => value.replace("v2", "v3"),
      ],
    }),
    "v1",
  ),
);

test(
  "custom file extension",
  testSerializer(new TextSerializer({ fileExtension: "md" }), "# Heading"),
);
