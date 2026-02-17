import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("aria-description", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <input type="text" aria-label="Label" aria-description="Description" />
    `,
  );
});

test("aria-describedby", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <input type="text" aria-label="Label" aria-describedby="description" />
      <p id="description">Description</p>
    `,
  );
});

test("aria-describedby takes precedence over aria-description", async ({
  page,
}) => {
  await matchRawElementSnapshot(
    page,
    html`
      <input
        type="text"
        aria-label="Label"
        aria-description="Direct Description"
        aria-describedby="description"
      />
      <p id="description">Referenced Description</p>
    `,
  );
});
