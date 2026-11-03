import { describe, expect, test } from "vitest";

import { findUnusedSnapshots } from "../find-unused-snapshots";

import { createFiles, useTmpDir } from "./test-utils";

describe("find unused snapshots", () => {
  useTmpDir();

  test("returns validation files without output file", async () => {
    await createFiles([
      "data/test/validation/used.json",
      "data/test/validation/unused.json",
      "data/test/validation/nested/used.txt",
      "data/test/validation/nested/unused.txt",
      "data/test/output/used.json",
      "data/test/output/nested/used.txt",
      "data/test/output/new.json",
    ]);

    await expect(findUnusedSnapshots()).resolves.toEqual([
      {
        dir: "data/test",
        file: "nested/unused.txt",
        path: "data/test/validation/nested/unused.txt",
      },
      {
        dir: "data/test",
        file: "unused.json",
        path: "data/test/validation/unused.json",
      },
    ]);
  });

  test("returns no files when all validation files are used", async () => {
    await createFiles([
      "data/test/validation/used.json",
      "data/test/output/used.json",
    ]);

    await expect(findUnusedSnapshots()).resolves.toEqual([]);
  });

  test("treats missing output directory as empty", async () => {
    await createFiles(["data/test/validation/unused.json"]);

    await expect(findUnusedSnapshots()).resolves.toEqual([
      expect.objectContaining({ file: "unused.json" }),
    ]);
  });

  test("checks multiple directories", async () => {
    await createFiles([
      "data/unit-test/validation/unused.json",
      "data/unit-test/output/other.json",
      "custom-data/validation/unused.json",
      "custom-data/validation/used.json",
      "custom-data/output/used.json",
    ]);

    await expect(
      findUnusedSnapshots({ dirs: ["data/unit-test", "custom-data"] }),
    ).resolves.toEqual([
      expect.objectContaining({
        path: "data/unit-test/validation/unused.json",
      }),
      expect.objectContaining({ path: "custom-data/validation/unused.json" }),
    ]);
  });

  test("throws when validation directory does not exist", async () => {
    await expect(findUnusedSnapshots({ dirs: ["missing"] })).rejects.toThrow(
      'Validation directory "missing/validation" does not exist',
    );
  });

  test("excludes files matching ignore patterns", async () => {
    await createFiles([
      "data/test/validation/smoke/a.json",
      "data/test/validation/smoke/nested/b.json",
      "data/test/validation/flaky.txt",
      "data/test/validation/unused.json",
    ]);

    await expect(
      findUnusedSnapshots({ ignore: ["smoke/**", "*.txt"] }),
    ).resolves.toEqual([expect.objectContaining({ file: "unused.json" })]);
  });

  test("throws when ignore pattern matches no validation file", async () => {
    await createFiles(["data/test/validation/used.json"]);

    await expect(
      findUnusedSnapshots({ ignore: ["*.json", "smoke/**", "*.md"] }),
    ).rejects.toThrow(
      'No validation file matches the ignore pattern(s) "smoke/**", "*.md"',
    );
  });
});
