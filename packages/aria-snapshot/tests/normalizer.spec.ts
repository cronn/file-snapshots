import test from "@playwright/test";

import { matchAriaSnapshot } from "../src/test/fixtures";

test("when snapshot contains an array, normalizes all items", async ({
  page,
}) => {
  await matchAriaSnapshot(
    page,
    `
      <p>First Paragraph</p>
      <p>Second Paragraph</p>
    `,
  );
});

test("when snapshot contains an object, normalizes all properties", async ({
  page,
}) => {
  await matchAriaSnapshot(
    page,
    `
      <main>
        <h1>Heading</h1>
        <p>Paragraph</p>
      </main>
    `,
  );
});

test("when array contains exactly one element, unwraps the element", async ({
  page,
}) => {
  await matchAriaSnapshot(
    page,
    `
      <main>
        <p>Paragraph</p>
      </main>
    `,
  );
});

test("replaces double quotes around text by single quotes", async ({
  page,
}) => {
  await matchAriaSnapshot(
    page,
    `<input type="text" aria-label="Input Name" />`,
  );
});

test("reduces text node to aggregated string", async ({ page }) => {
  await matchAriaSnapshot(page, `<p>Text</p>`);
});
