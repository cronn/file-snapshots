import { describe, expect, test } from "vitest";

import {
  EXIT_CODE_ERROR,
  EXIT_CODE_SUCCESS,
  EXIT_CODE_UNUSED_SNAPSHOTS,
  runCli,
} from "../run-cli";

import { createFiles, listAllFiles, useTmpDir } from "./test-utils";

async function run(args: Array<string>) {
  const stdout: Array<string> = [];
  const stderr: Array<string> = [];
  const exitCode = await runCli(args, {
    log: (message) => stdout.push(message),
    error: (message) => stderr.push(message),
  });
  return { exitCode, stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

describe("run CLI", () => {
  useTmpDir();

  test("check succeeds without unused validation files", async () => {
    await createFiles([
      "data/test/validation/used.json",
      "data/test/output/used.json",
    ]);

    await expect(run(["check"])).resolves.toEqual({
      exitCode: EXIT_CODE_SUCCESS,
      stdout: "No unused validation files found.",
      stderr: "",
    });
  });

  test("check fails with unused validation files", async () => {
    await createFiles([
      "data/test/validation/unused.json",
      "custom-data/validation/unused.json",
    ]);

    const result = await run([
      "check",
      "--dir",
      "data/test",
      "--dir",
      "custom-data",
    ]);

    expect(result.exitCode).toBe(EXIT_CODE_UNUSED_SNAPSHOTS);
    expect(result.stderr).toContain("Found 2 unused validation file(s):");
    expect(result.stderr).toContain("  • data/test/validation/unused.json");
    expect(result.stderr).toContain("  • custom-data/validation/unused.json");
    await expect(listAllFiles()).resolves.toHaveLength(2);
  });

  test("check respects --ignore", async () => {
    await createFiles(["data/test/validation/smoke/unused.json"]);

    await expect(run(["check", "--ignore", "smoke/**"])).resolves.toEqual(
      expect.objectContaining({ exitCode: EXIT_CODE_SUCCESS }),
    );
  });

  test("prune deletes unused validation files", async () => {
    await createFiles([
      "data/test/validation/unused.json",
      "data/test/validation/used.json",
      "data/test/output/used.json",
    ]);

    const result = await run(["prune"]);

    expect(result.exitCode).toBe(EXIT_CODE_SUCCESS);
    expect(result.stdout).toContain("Deleted data/test/validation/unused.json");
    await expect(listAllFiles()).resolves.toEqual([
      "data/test/output/used.json",
      "data/test/validation/used.json",
    ]);
  });

  test("clean deletes output directories", async () => {
    await createFiles([
      "data/test/validation/used.json",
      "data/test/output/used.json",
    ]);

    const result = await run(["clean"]);

    expect(result.exitCode).toBe(EXIT_CODE_SUCCESS);
    expect(result.stdout).toBe("Deleted data/test/output");
    await expect(listAllFiles()).resolves.toEqual([
      "data/test/validation/used.json",
    ]);
  });

  test.each([
    { name: "missing command", args: [], message: "Missing command" },
    {
      name: "unknown command",
      args: ["unknown"],
      message: 'Unknown command "unknown"',
    },
    {
      name: "multiple commands",
      args: ["check", "prune"],
      message: "Unexpected argument(s): prune",
    },
    {
      name: "positional argument",
      args: ["check", "data/test"],
      message: "Unexpected argument(s): data/test",
    },
    {
      name: "unknown option",
      args: ["check", "--unknown"],
      message: "Unknown option '--unknown'",
    },
  ])("fails with $name", async ({ args, message }) => {
    const result = await run(args);

    expect(result.exitCode).toBe(EXIT_CODE_ERROR);
    expect(result.stderr).toContain(message);
    expect(result.stderr).toContain("Usage: file-snapshots");
  });

  test("fails when validation directory does not exist", async () => {
    await expect(run(["check"])).resolves.toEqual({
      exitCode: EXIT_CODE_ERROR,
      stdout: "",
      stderr: 'Validation directory "data/test/validation" does not exist',
    });
  });

  test("--help prints usage", async () => {
    const result = await run(["--help"]);

    expect(result.exitCode).toBe(EXIT_CODE_SUCCESS);
    expect(result.stdout).toContain("Usage: file-snapshots");
  });

  test("--version prints version", async () => {
    const result = await run(["--version"]);

    expect(result.exitCode).toBe(EXIT_CODE_SUCCESS);
    expect(result.stdout).toMatch(/^\d+\.\d+\.\d+/);
  });
});
