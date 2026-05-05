import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { expect } from "../../src/test/fixtures";

test("excludes options by default", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <select aria-label="Select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("includes options of HTML select", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <select aria-label="Select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    includeComboboxOptions: true,
  });
});

test("includes options from referenced listbox", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <input
        type="text"
        role="combobox"
        aria-label="Combobox"
        value="Option 1"
        aria-controls="options"
        aria-expanded="false"
      />
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    includeComboboxOptions: true,
  });
});

test("excludes empty options", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <input type="text" role="combobox" aria-label="Combobox" value="Value" />
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    includeComboboxOptions: true,
  });
});

test("exclude options minimal case", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <input
        type="text"
        role="combobox"
        aria-label="Combobox"
        aria-controls="options"
        aria-expanded="false"
      />
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile();
});

test("include options minimal case", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <input
        type="text"
        role="combobox"
        aria-label="Combobox"
        aria-controls="options"
        aria-expanded="false"
      />
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
      </ul>
    `,
  );

  await expect(bodyLocator).toMatchSemanticSnapshotFile({
    includeComboboxOptions: true,
  });
});
