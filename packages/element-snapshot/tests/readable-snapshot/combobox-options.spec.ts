import test from "@playwright/test";

import { setupTransformedSnapshotTest } from "../../src/test/fixtures";

test("excludes options by default", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <select aria-label="Select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );

  await matchSnapshot();
});

test("includes options of HTML select", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <select aria-label="Select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );

  await matchSnapshot({ includeComboboxOptions: true });
});

test("includes options from referenced listbox", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
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

  await matchSnapshot({ includeComboboxOptions: true });
});

test("excludes empty options", async ({ page }) => {
  const matchSnapshot = await setupTransformedSnapshotTest(
    page,
    `
      <input
        type="text"
        role="combobox"
        aria-label="Combobox"
        value="Value"
      />
    `,
  );

  await matchSnapshot({ includeComboboxOptions: true });
});
