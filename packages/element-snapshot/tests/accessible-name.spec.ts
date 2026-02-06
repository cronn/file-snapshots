import test from "@playwright/test";

import { matchRawElementSnapshot } from "../src/test/fixtures";

test("surrounding HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<label><input type="checkbox" /> Label</label>`,
  );
});

test("referenced HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Label</label>
      <input type="text" id="input" />
    `,
  );
});

test("aria-label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `<input type="text" aria-label="Label" />`,
  );
});

test("aria-labelledby", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <p id="label">Label</p>
      <input type="text" aria-labelledby="label" />
    `,
  );
});

test("aria-labelledby takes precedence over aria-label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <p id="label">Referenced Label</p>
      <input
        type="text"
        aria-labelledby="label"
        aria-label="Direct Label"
      />
    `,
  );
});

test("aria-labelledby takes precedence over HTML label", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
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
    `
      <p id="label">Referenced Label</p>
      <label>
        <input type="text" aria-label="Direct Label" />
        HTML Label
      </label>
    `,
  );
});

test("text content", async ({ page }) => {
  await matchRawElementSnapshot(page, `<button>Text content</button>`);
});
