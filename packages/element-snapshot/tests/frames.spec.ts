import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { rawSnapshot } from "../src/playwright/snapshot";
import { expect } from "../src/test/fixtures";

test("element inside iframe", async ({ page }) => {
  await setupSnapshotTest(
    page,
    html`<iframe
      title="Frame"
      srcdoc="<button>Inside frame</button>"
    ></iframe>`,
  );

  const frameLocator = page.frameLocator("iframe").locator("body");

  await expect(await rawSnapshot(frameLocator)).toMatchJsonFile();
});

test("element inside iframe after snapshot of main frame", async ({ page }) => {
  await setupSnapshotTest(
    page,
    html`<button>Outside frame</button>
      <iframe title="Frame" srcdoc="<button>Inside frame</button>"></iframe>`,
  );

  await rawSnapshot(page);
  const frameLocator = page.frameLocator("iframe").locator("body");

  await expect(await rawSnapshot(frameLocator)).toMatchJsonFile();
});
