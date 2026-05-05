import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { expect } from "../../src/test/fixtures";

test("when snapshot contains multiple elements, returns array of elements", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <p>First Paragraph</p>
      <p>Second Paragraph</p>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when snapshot contains exactly one element, returns the element", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`<p>Single Paragraph</p>`,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when element is empty, resolves value to empty string", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(page, html`<p></p>`);

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when element has only a name, resolves value to name", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`<input type="text" aria-label="Input Name" />`,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when element has only children, resolves value to children", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <main>
        <h1>Headline</h1>
        <p>Paragraph</p>
      </main>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("flattens defined attributes", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`<input
      type="text"
      aria-label="Input Name"
      value="Input Value"
      readonly
    />`,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when name equals children, excludes children", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, html`<h1>Heading</h1>`);

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when element has name and children, includes children property", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <section aria-labelledby="heading">
        <h2 id="heading">Heading</h2>
        <p>Paragraph</p>
      </section>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("when element has attributes and children, includes children property", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <a href="/target">
        <img src="/image.jpg" alt="Image" />
      </a>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});
