import { beforeEach, expect, test } from "vitest";

import { maskString } from "@cronn/lib-file-snapshots";

import { registerFileSnapshotMatchers } from "../matchers/register-matchers";
import { testFilePathResolver } from "../utils/test";

beforeEach(() => registerFileSnapshotMatchers());

test("matches value with text file", () => {
  expect("value").toMatchTextFile();
});

test("when value cannot be serialized, throws error", () => {
  expect(() => expect(4711).toMatchTextFile()).toThrowError();
});

test("when matcher is inverted, throws error", () => {
  expect(() => expect("value").not.toMatchTextFile()).toThrowError();
});

test("applies normalizer", () => {
  expect("2000-01-01").toMatchTextFile({
    normalizers: [maskString("2000-01-01", "<TODAY>")],
  });
});

test("applies name", () => {
  expect.soft("value1").toMatchTextFile({ name: "value 1" });
  expect.soft("value2").toMatchTextFile({ name: "value 2" });
});

test("applies custom file path resolver", () => {
  expect("value").toMatchTextFile({
    name: "name",
    resolveFilePath: testFilePathResolver,
  });
});

test("applies custom file extension", () => {
  expect("# Heading").toMatchTextFile({
    fileExtension: "md",
  });
});
