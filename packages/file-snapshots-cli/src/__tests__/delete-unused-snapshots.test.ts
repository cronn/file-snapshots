import { describe, expect, test } from "vitest";

import { deleteUnusedSnapshots } from "../delete-unused-snapshots";
import { isDirectory } from "../utils/file";

import { createFiles, listAllFiles, useTmpDir } from "./test-utils";

describe("delete unused snapshots", () => {
  useTmpDir();

  test("deletes unused validation files and empty directories", async () => {
    await createFiles([
      "data/test/validation/used.json",
      "data/test/validation/unused.json",
      "data/test/validation/nested/deep/unused.json",
      "data/test/validation/partial/used.json",
      "data/test/validation/partial/unused.json",
      "data/test/output/used.json",
      "data/test/output/partial/used.json",
    ]);

    const deletedSnapshots = await deleteUnusedSnapshots({
      ignore: ["used.json"],
    });

    expect(deletedSnapshots.map((snapshot) => snapshot.path)).toEqual([
      "data/test/validation/nested/deep/unused.json",
      "data/test/validation/partial/unused.json",
      "data/test/validation/unused.json",
    ]);
    await expect(listAllFiles()).resolves.toEqual([
      "data/test/output/partial/used.json",
      "data/test/output/used.json",
      "data/test/validation/partial/used.json",
      "data/test/validation/used.json",
    ]);
    await expect(isDirectory("data/test/validation/nested")).resolves.toBe(
      false,
    );
  });

  test("keeps validation directory when all files are deleted", async () => {
    await createFiles(["data/test/validation/nested/unused.json"]);

    await deleteUnusedSnapshots();

    await expect(isDirectory("data/test/validation")).resolves.toBe(true);
    await expect(listAllFiles()).resolves.toEqual([]);
  });
});
