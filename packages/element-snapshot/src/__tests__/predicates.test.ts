import { describe, expect, test } from "vitest";

import type { ElementSnapshot } from "../browser/types";
import { elementSnapshot } from "../utils/factories";
import { excludeRole, includeRole } from "../utils/predicates";

describe("includeRole", () => {
  const paragraphSnapshot: ElementSnapshot = elementSnapshot({
    role: "paragraph",
  });

  test("when snapshot has provided role, returns true", () => {
    const hasRoleParagraph = includeRole("paragraph");
    expect(hasRoleParagraph(paragraphSnapshot)).toBe(true);
  });

  test("when snapshot has different role, returns false", () => {
    const hasRoleList = includeRole("list");
    expect(hasRoleList(paragraphSnapshot)).toBe(false);
  });
});

describe("excludeRole", () => {
  const paragraphSnapshot: ElementSnapshot = elementSnapshot({
    role: "paragraph",
  });

  test("when snapshot has provided role, returns false", () => {
    const hasRoleParagraph = excludeRole("paragraph");
    expect(hasRoleParagraph(paragraphSnapshot)).toBe(false);
  });

  test("when snapshot has different role, returns true", () => {
    const hasRoleList = excludeRole("list");
    expect(hasRoleList(paragraphSnapshot)).toBe(true);
  });
});
