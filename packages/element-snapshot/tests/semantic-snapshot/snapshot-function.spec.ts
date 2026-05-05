import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { semanticSnapshot } from "../../src/playwright/snapshot";
import { expect } from "../../src/test/fixtures";

test("combined snapshot", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <nav>Sidenav</nav>
      <main>Main Content</main>
    `,
  );

  await expect({
    sidenav: await semanticSnapshot(bodyLocator.getByRole("navigation")),
    content: await semanticSnapshot(bodyLocator.getByRole("main")),
  }).toMatchJsonFile();
});
