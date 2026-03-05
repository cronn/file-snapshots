import { describe, expect, test } from "vitest";

import type { ElementSnapshot } from "../browser/types";
import { elementSnapshot } from "../utils/factories";
import { excludeRole, includeRole } from "../utils/predicates";

describe("includeRole", () => {
  const paragraphSnapshot: ElementSnapshot = elementSnapshot({
    role: "paragraph",
  });

  test("when snapshot has provided role, returns true", () => {
    const includeParagraph = includeRole("paragraph");
    expect(includeParagraph(paragraphSnapshot)).toBe(true);
  });

  test("when snapshot does not have provided role, returns false", () => {
    const includeHeading = includeRole("heading");
    expect(includeHeading(paragraphSnapshot)).toBe(false);
  });
});

describe("excludeRole", () => {
  const paragraphSnapshot: ElementSnapshot = elementSnapshot({
    role: "paragraph",
  });

  test("when snapshot has provided role, returns false", () => {
    const excludeParagraph = excludeRole("paragraph");
    expect(excludeParagraph(paragraphSnapshot)).toBe(false);
  });

  test("when snapshot does not have provided role, returns true", () => {
    const excludeHeading = excludeRole("heading");
    expect(excludeHeading(paragraphSnapshot)).toBe(true);
  });
});
