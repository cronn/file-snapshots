import { expect, test } from "vitest";

import { roleSelector, selectorList } from "../browser/selector";

test("returns comma-separated list of selectors", () => {
  expect(selectorList("a", "button")).toBe("a,button");
});

test("returns attribute selector for specified role", () => {
  expect(roleSelector("link")).toBe("[role='link']");
});
