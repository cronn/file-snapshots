import { describe, expect, test } from "vitest";

import { normalizeFileName } from "./file";

describe("normalize file name", () => {
  test.each([
    { name: "whitespace", value: " " },
    {
      name: "tab",
      value: "\t",
    },
    { name: "newline", value: "\n" },
    { name: "dot", value: "." },
    { name: "colon", value: ":" },
    { name: "comma", value: "," },
    { name: "semicolon", value: ";" },
  ])("replaces $name by underscore", ({ value }) => {
    expect(normalizeFileName(value)).toBe("_");
  });

  test.each([
    "+",
    "*",
    "%",
    "~",
    "<",
    ">",
    "?",
    "!",
    "$",
    "#",
    "'",
    '"',
    "`",
    "|",
    "\\",
    "/",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
  ])("removes '%s' from test name", (value) => {
    expect(normalizeFileName(value)).toBe("");
  });

  test.each([
    "*️⃣#️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟",
    "😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😌😍🥰😘",
    "⌚⌛⏩⏬⏰⏳◽◾☔☕♈♓♿",
    "👨‍❤️‍👨👨‍❤️‍💋‍👨👨‍👦👨‍👦‍👦👨‍👧👨‍👧‍👦👨‍👧‍👧👨‍👨‍👦👨‍👨‍👦‍👦👨‍👨‍👨🏻‍❤️‍👨🏾",
  ])("removes emojis %s from test name", (value) => {
    expect(normalizeFileName(value)).toBe("");
  });

  test("collapses sequential word delimiters to single underscore", () => {
    expect(normalizeFileName(" \t_")).toBe("_");
  });
});
