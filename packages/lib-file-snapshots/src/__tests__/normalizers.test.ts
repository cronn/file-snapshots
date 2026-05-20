import { describe, expect, test } from "vitest";

import { maskPattern } from "../normalizers/mask-pattern";
import { maskString } from "../normalizers/mask-string";
import { stringNormalizer } from "../normalizers/string-normalizer";

describe("stringNormalizer", () => {
  const uppercaseNormalizer = stringNormalizer((value) => value.toUpperCase());

  test("when value is of type string, applies normalizer", () => {
    expect(uppercaseNormalizer("value")).toBe("VALUE");
  });

  test("when value is not of type string, return original value", () => {
    expect(uppercaseNormalizer(true)).toBe(true);
  });
});

test("masks all occurrences of string", () => {
  const maskBaseUrl = maskString("https://example.com", "<BASE_URL>");
  expect(
    maskBaseUrl(`
      - [Home](https://example.com/home)
      - [About Us](https://example.com/about)
      - [Blog](https://example.com/blog)`),
  ).toBe(`
      - [Home](<BASE_URL>/home)
      - [About Us](<BASE_URL>/about)
      - [Blog](<BASE_URL>/blog)`);
});

test("masks all occurrences of pattern", () => {
  const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g;
  const maskDate = maskPattern(
    timestampRegex,
    (counter) => `<TIMESTAMP_${counter}>`,
  );
  expect(
    maskDate(
      `
      2026-05-21T08:00:01Z Application started successfully
      2026-05-21T08:03:23Z User login successful
      2026-05-21T08:05:46Z Payment failed`,
    ),
  ).toBe(`
      <TIMESTAMP_0> Application started successfully
      <TIMESTAMP_1> User login successful
      <TIMESTAMP_2> Payment failed`);
});
