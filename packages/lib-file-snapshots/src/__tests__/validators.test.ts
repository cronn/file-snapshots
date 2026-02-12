import { describe, expect, test } from "vitest";

import { isPositiveInteger } from "../utils/validators";

describe("is positive integer", () => {
  test.each([1, 2, 4711])("%s is positive integer", (value) => {
    expect(isPositiveInteger(value)).toBe(true);
  });

  test.each([-1, 0, 1.5, Number.POSITIVE_INFINITY])(
    "%s is no positive integer",
    (value) => {
      expect(isPositiveInteger(value)).toBe(false);
    },
  );
});
