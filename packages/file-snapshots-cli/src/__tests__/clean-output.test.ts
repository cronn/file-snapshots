import { describe, expect, test } from "vitest";

import { cleanOutput } from "../clean-output";

import { createFiles, listAllFiles, useTmpDir } from "./test-utils";

describe("clean output", () => {
  useTmpDir();

  test("deletes output directories", async () => {
    await createFiles([
      "data/test/validation/a.json",
      "data/test/output/a.json",
      "data/test/output/nested/b.json",
      "custom-data/validation/a.json",
      "custom-data/output/a.json",
    ]);

    await expect(
      cleanOutput({ dirs: ["data/test", "custom-data", "missing"] }),
    ).resolves.toEqual(["data/test/output", "custom-data/output"]);
    await expect(listAllFiles()).resolves.toEqual([
      "custom-data/validation/a.json",
      "data/test/validation/a.json",
    ]);
  });

  test("uses data/test by default", async () => {
    await createFiles(["data/test/output/a.json"]);

    await expect(cleanOutput()).resolves.toEqual(["data/test/output"]);
  });
});
