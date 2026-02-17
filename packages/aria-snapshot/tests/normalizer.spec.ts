import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchAriaSnapshot } from "../src/test/fixtures";

test("when snapshot contains an array, normalizes all items", async ({
  page,
}) => {
  await matchAriaSnapshot(
    page,
    html`
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
    html`
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
    html`
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
    html`<input type="text" aria-label="Input Name" />`,
  );
});

test("reduces text node to aggregated string", async ({ page }) => {
  await matchAriaSnapshot(page, html`<p>Text</p>`);
});
