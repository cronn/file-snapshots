import test from "@playwright/test";

import { setupTransformedSnapshotTest } from "../../src/test/fixtures";

test("when snapshot contains multiple elements, returns array of elements", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <p>First Paragraph</p>
      <p>Second Paragraph</p>
    `,
  );

  await matchSnapshot();
});

test("when snapshot contains exactly one element, returns the element", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `<p>Single Paragraph</p>`,
  );

  await matchSnapshot();
});

test("when element is empty, resolves value to empty string", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(page, `<p></p>`);

  await matchSnapshot();
});

test("when element has only a name, resolves value to name", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `<input type="text" aria-label="Input Name" />`,
  );

  await matchSnapshot();
});

test("when element has only children, resolves value to children", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <main>
        <h1>Headline</h1>
        <p>Paragraph</p>
      </main>
    `,
  );

  await matchSnapshot();
});

test("flattens defined attributes", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `<input type="text" aria-label="Input Name" value="Input Value" readonly />`,
  );

  await matchSnapshot();
});

test("when name equals children, excludes children", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `<h1>Heading</h1>`,
  );

  await matchSnapshot();
});

test("when element has name and children, includes children property", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <section aria-labelledby="heading">
        <h2 id="heading">Heading</h2>
        <p>Paragraph</p>
      </section>
    `,
  );

  await matchSnapshot();
});

test("when element has attributes and children, includes children property", async ({
  page,
}) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <a href="/target">
        <img src="/image.jpg" alt="Image" />
      </h1>
    `,
  );

  await matchSnapshot();
});
