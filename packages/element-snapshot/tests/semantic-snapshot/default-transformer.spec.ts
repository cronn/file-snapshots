import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { getTextContent } from "../../src";
import { expect } from "../../src/test/fixtures";

test("applies default transformer", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <h1>Heading</h1>
      <p>Paragraph</p>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    defaultTransformer: (snapshot) => getTextContent([snapshot]),
  });
});

test("applies default transformer to descendants", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <ul>
        <li>
          Fruits
          <ul>
            <li>Apple</li>
            <li>Pear</li>
          </ul>
        </li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    defaultTransformer: (snapshot, { transform }) => {
      if ("children" in snapshot && snapshot.children.length > 0) {
        return { [snapshot.role]: snapshot.children.map(transform) };
      }

      return { [snapshot.role]: snapshot.name };
    },
  });
});

test("applies role-based transformers before default transformer", async ({
  page,
}) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <h1>Heading</h1>
      <p>Paragraph</p>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    transformers: {
      heading: (snapshot) => `heading:${snapshot.name}`,
    },
    defaultTransformer: (snapshot) => `default:${getTextContent([snapshot])}`,
  });
});
