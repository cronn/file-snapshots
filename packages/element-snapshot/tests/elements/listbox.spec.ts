import test from "@playwright/test";

import { html } from "@cronn/test-utils/playwright";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("role-based listbox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="listbox" aria-label="Listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
        <li role="option" aria-disabled="true">Option 3</li>
      </ul>
    `,
  );
});

test("role-based multiselectable listbox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="listbox" aria-label="Listbox" aria-multiselectable="true">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
        <li role="option" aria-selected="true">Option 3</li>
      </ul>
    `,
  );
});

test("role-based listbox with aria-multiselectable=false", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="listbox" aria-label="Listbox" aria-multiselectable="false">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );
});

test("role-based listbox with input state", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul
        role="listbox"
        aria-label="Listbox"
        aria-description="Description"
        aria-disabled="true"
        aria-readonly="true"
        aria-required="true"
        aria-invalid="true"
      >
        <li role="option">Option 1</li>
      </ul>
    `,
  );
});

test("role-based listbox with option groups", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div role="listbox" aria-label="Listbox">
        <div role="option" aria-selected="false">Option 1</div>
        <div role="group" aria-label="Group 1">
          <div role="option" aria-selected="true">Option 2</div>
          <div role="option" aria-selected="false">Option 3</div>
        </div>
      </div>
    `,
  );
});

test("expanded listbox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <ul role="listbox" aria-label="Listbox" aria-expanded="true">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );
});
