import { describe, expect, test } from "vitest";

import { elementSnapshot, textSnapshot } from "../utils/factories";
import { getTextContent, normalizeText } from "../utils/text";

describe("getTextContent", () => {
  test("returns text from text snapshots only", () => {
    expect(
      getTextContent([
        textSnapshot("Text"),
        elementSnapshot({ role: "img", name: "Image" }),
      ]),
    ).toBe("Text");
  });

  test("concatenates text from multiple text snapshots", () => {
    expect(
      getTextContent([
        textSnapshot("Text"),
        elementSnapshot({
          role: "paragraph",
          children: [textSnapshot("Paragraph")],
        }),
      ]),
    ).toBe("Text Paragraph");
  });
});

describe("normalizeText", () => {
  test("removes leading whitespaces", () => {
    expect(normalizeText(" \t\r\n\v\f text")).toBe("text");
  });

  test("removes trailing whitespaces", () => {
    expect(normalizeText("text \t\r\n\v\f ")).toBe("text");
  });

  test("replaces multiple infix whitespaces by single whitespace", () => {
    expect(normalizeText("word1 \t\r\n\v\f word2")).toBe("word1 word2");
  });
});
