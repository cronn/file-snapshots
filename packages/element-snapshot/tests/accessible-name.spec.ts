import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("surrounding HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<label>
      <input type="checkbox" />
      Label
      <span aria-hidden="true">Hidden</span>
    </label>`,
  );
});

test("referenced HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">
        Label
        <span aria-hidden="true">Hidden</span>
      </label>
      <input type="text" id="input" />
    `,
  );
});

test("aria-label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input type="text" aria-label="Label" />`,
  );
});

test("aria-labelledby", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <p id="label">
        Label
        <span aria-hidden="true">Hidden</span>
      </p>
      <input type="text" aria-labelledby="label" />
    `,
  );
});

test("aria-labelledby takes precedence over aria-label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <p id="label">Referenced Label</p>
      <input type="text" aria-labelledby="label" aria-label="Direct Label" />
    `,
  );
});

test("aria-labelledby takes precedence over HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <p id="label">Referenced Label</p>
      <label>
        <input type="text" aria-labelledby="label" />
        HTML Label
      </label>
    `,
  );
});

test("aria-label takes precedence over HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <p id="label">Referenced Label</p>
      <label>
        <input type="text" aria-label="Direct Label" />
        HTML Label
      </label>
    `,
  );
});

test("text content", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <button>
        Text
        <img src="image.jpg" alt="Image" />
        <p>Paragraph</p>
        <span aria-hidden="true">Hidden</span>
      </button>
    `,
  );
});
