import { describe, expect, test } from "vitest";

import { elementSnapshot, textSnapshot } from "../utils/factories";
import { filter } from "../utils/filter";
import { excludeRole, includeRole } from "../utils/predicates";

describe("filter", () => {
  test("does not recurse filtered snapshots", () => {
    expect(
      filter({
        predicate: includeRole("main"),
        snapshots: [
          elementSnapshot({
            role: "main",
            children: [elementSnapshot({ role: "paragraph" })],
          }),
        ],
      }),
    ).toMatchJsonFile();
  });

  test("recurses filtered snapshots", () => {
    expect(
      filter({
        predicate: excludeRole("paragraph"),
        recurse: true,
        snapshots: [
          elementSnapshot({
            role: "main",
            children: [
              textSnapshot("Text"),
              elementSnapshot({ role: "paragraph" }),
            ],
          }),
        ],
      }),
    ).toMatchJsonFile();
  });
});
