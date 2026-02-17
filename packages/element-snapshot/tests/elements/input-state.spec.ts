import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("readonly input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input type="text" aria-label="Readonly Input" readonly />`,
  );
});

test("aria-readonly input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input
      type="text"
      aria-label="ARIA-Readonly Input"
      aria-readonly="true"
    />`,
  );
});

test("disabled input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input type="text" aria-label="Disabled Input" disabled />`,
  );
});

test("aria-disabled input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input
      type="text"
      aria-label="ARIA-Disabled Input"
      aria-disabled="true"
    />`,
  );
});

test("required input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input type="text" aria-label="Required Input" required />`,
  );
});

test("aria-required input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input
      type="text"
      aria-label="ARIA-Required Input"
      aria-required="true"
    />`,
  );
});

test("aria-invalid input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input
      type="text"
      aria-label="ARIA-Invalid Input"
      aria-invalid="true"
    />`,
  );
});

test("input with placeholder", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<input type="text" aria-label="Input" placeholder="Placeholder" />`,
  );
});

test("textarea with placeholder", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`<textarea aria-label="Textarea" placeholder="Placeholder"></textarea>`,
  );
});

test("input with value and placeholder", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <input
        type="text"
        aria-label="Input"
        value="Value"
        placeholder="Placeholder"
      />
    `,
  );
});

test("expanded input-based combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label>
        Combobox
        <input
          type="text"
          role="combobox"
          value="Input Value"
          aria-controls="options"
          aria-expanded="true"
        />
      </label>
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );
});

test("expanded button-based combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <button
        type="button"
        role="combobox"
        aria-label="Combobox"
        aria-controls="options"
        aria-expanded="true"
      >
        Button Value
      </button>
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );
});
