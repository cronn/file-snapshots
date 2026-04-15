import { describe, expect, test } from "vitest";

import { elementSnapshot } from "../utils/factories";
import { hasRole, isEmpty, isTextSnapshot } from "../utils/guards";

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

describe("hasRole", () => {
  const paragraphSnapshot = elementSnapshot({
    role: "paragraph",
  });

  test("when snapshot has provided role, returns true", () => {
    expect(hasRole("paragraph", paragraphSnapshot)).toBe(true);
  });

  test("when snapshot has any of the provided roles, returns true", () => {
    expect(hasRole(["heading", "paragraph"], paragraphSnapshot)).toBe(true);
  });

  test("when snapshot does not have the provided role, returns false", () => {
    expect(hasRole("heading", paragraphSnapshot)).toBe(false);
  });

  test("when snapshot has none of the provided roles, returns false", () => {
    expect(hasRole(["heading", "list"], paragraphSnapshot)).toBe(false);
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
