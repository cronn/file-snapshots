import test from "@playwright/test";

import { setupTransformedSnapshotTest } from "../../src/test/fixtures";

test("includes heading elements", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <main>
        <h1>Heading</h1>
        <p>Text</p>
        <hr />
        <h2>Subheading</h2>
        <p>Text</p>
      </main>
    `,
  );

  await matchSnapshot({
    filter: (element) => element.role === "heading",
  });
});

test("excludes separator elements", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <main>
        <h1>Heading</h1>
        <p>Text</p>
        <hr />
        <h2>Subheading</h2>
        <p>Text</p>
      </main>
    `,
  );

  await matchSnapshot({
    filter: (element) => element.role !== "separator",
  });
});
