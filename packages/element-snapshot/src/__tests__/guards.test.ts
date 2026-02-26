import { describe, expect, test } from "vitest";

import { isEmpty, isTextSnapshot } from "../utils/guards";

describe("isTextSnapshot", () => {
  test("when value is text snapshot, returns true", () => {
    expect(isTextSnapshot({ role: "text", name: "Text" })).toBe(true);
  });

  test("when value is element snapshot, returns false", () => {
    expect(isTextSnapshot({ role: "main", attributes: {}, children: [] })).toBe(
      false,
    );
  });
});

describe("isEmpty", () => {
  test.each([{ value: "" }, { value: [] }, { value: {} }])(
    "when value is $value, returns true",
    () => {
      expect(isEmpty("")).toBe(true);
    },
  );

  test.each([
    { value: "value" },
    { value: ["value"] },
    { value: { key: "value" } },
  ])("when value is $value, returns false", () => {
    expect(isEmpty("")).toBe(true);
  });
});
