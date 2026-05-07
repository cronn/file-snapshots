import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { expect } from "../src/test/fixtures";

test("when snapshot contains an array, normalizes all items", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <p>First Paragraph</p>
      <p>Second Paragraph</p>
    `,
  );

  await expect(bodyLocator).toMatchAriaSnapshotFile();
});

test("when snapshot contains an object, normalizes all properties", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <main>
        <h1>Heading</h1>
        <p>Paragraph</p>
      </main>
    `,
  );

  await expect(bodyLocator).toMatchAriaSnapshotFile();
});

test("when array contains exactly one element, unwraps the element", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <main>
        <p>Paragraph</p>
      </main>
    `,
  );

  await expect(bodyLocator).toMatchAriaSnapshotFile();
});

test("replaces double quotes around text by single quotes", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`<input type="text" aria-label="Input Name" />`,
  );

  await expect(bodyLocator).toMatchAriaSnapshotFile();
});

test("reduces text node to aggregated string", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, html`<p>Text</p>`);

  await expect(bodyLocator).toMatchAriaSnapshotFile();
});
