import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { rawSnapshot } from "../../src/playwright/snapshot";
import { expect, matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML details", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <details>
        <summary>Summary</summary>
        <p>Content</p>
      </details>
    `,
  );
});

test("HTML details with text content", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <details>
        <summary>Summary</summary>
        Content
      </details>
    `,
  );
});

test("HTML details with open attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <details open>
        <summary>Summary</summary>
        <p>Content</p>
      </details>
    `,
  );
});

test("HTML details opened by click", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <details>
        <summary>Summary</summary>
        <p>Content</p>
      </details>
    `,
  );

  await page.getByText("Summary").click();

  await expect(rawSnapshot(bodyLocator)).toMatchJsonFile();
});

test("HTML details with aria-label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <details aria-label="Details" open>
        <summary>Summary</summary>
        <p>Content</p>
      </details>
    `,
  );
});

test("HTML details with multiple summaries", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <details>
        <summary>First Summary</summary>
        <summary>Second Summary</summary>
      </details>
    `,
  );
});
