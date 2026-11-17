import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { expect } from "../../src/test/fixtures";
import { excludeRole } from "../../src/utils/predicates";
import { getTextContent } from "../../src/utils/text";

test("applies transformers by role", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <h1>Fruits</h1>
      <ul>
        <li>Apple</li>
        <li>Pear</li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    transformers: {
      heading: (snapshot) => snapshot.name,
      listitem: (snapshot) => getTextContent(snapshot.children),
    },
  });
});

test("transforms untransformed children with the default transformation", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <ul>
        <li>Apple</li>
        <li>Pear</li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    transformers: {
      list: (snapshot, { transform }) =>
        snapshot.children.map((child) => transform(child)),
    },
  });
});

test("applies transformers to transformed descendants", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <main>
        <ul>
          <li>Apple</li>
          <li>Pear</li>
        </ul>
      </main>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    transformers: {
      main: (snapshot, { transform }) => snapshot.children.map(transform),
      listitem: (snapshot) => getTextContent(snapshot.children),
    },
  });
});

test("applies transformers after the filter", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <ul>
        <li>Apple <a href="/apple">Details</a></li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    filter: excludeRole("link"),
    recurseFilter: true,
    transformers: {
      cell: (snapshot) => getTextContent(snapshot.children),
    },
  });
});

test("transforms text nodes", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(page, html`<p>Paragraph</p>`);

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    transformers: {
      text: (snapshot) => snapshot.name.toUpperCase(),
    },
  });
});

test("does not reapply transformer to already visited node", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(page, html`<p>Paragraph</p>`);
  let visitedCount = 0;

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    transformers: {
      text: (snapshot, { transform }) => {
        visitedCount++;
        return transform({
          ...snapshot,
          name: `${snapshot.name} ${visitedCount}`,
        });
      },
    },
  });
});
