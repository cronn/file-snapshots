import test from "@playwright/test";

import { html, setupSnapshotTest } from "@cronn/test-utils/playwright";

import { rawSnapshot } from "../../src/playwright/snapshot";
import { expect, matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML text input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Text Input</label>
      <input type="text" id="input" name="input" value="Text" />
    `,
  );
});

test("HTML email input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Email Input</label>
      <input type="email" id="input" name="input" value="mail@example.com" />
    `,
  );
});

test("HTML tel input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Tel Input</label>
      <input type="tel" id="input" name="input" value="+49 123 456789" />
    `,
  );
});

test("HTML password input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Password Input</label>
      <input type="password" id="input" name="input" value="secret" />
    `,
  );
});

test("HTML number input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Number Input</label>
      <input
        type="number"
        id="input"
        name="input"
        value="1"
        min="1"
        max="10"
        step="1"
      />
    `,
  );
});

test("HTML range input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Range Input</label>
      <input type="range" id="input" name="input" value="0" min="0" max="100" />
    `,
  );
});

test("HTML date input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Date Input</label>
      <input type="date" id="input" name="input" value="2020-06-15" />
    `,
  );
});

test("HTML time input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Time Input</label>
      <input type="time" id="input" name="input" value="12:00" />
    `,
  );
});

test("HTML checkbox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label>
        <input type="checkbox" name="input" checked />
        Checked
      </label>
      <label>
        <input type="checkbox" name="input" />
        Unchecked
      </label>
    `,
  );
});

test("HTML checkbox with indeterminate state", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <label>
        <input type="checkbox" name="input" />
        Indeterminate
      </label>
      <label>
        <input type="checkbox" name="input" checked />
        Checked and indeterminate
      </label>
    `,
  );

  await page.getByRole("checkbox").evaluateAll((checkboxes) => {
    for (const checkbox of checkboxes) {
      (checkbox as HTMLInputElement).indeterminate = true;
    }
  });

  await expect(rawSnapshot(bodyLocator)).toMatchJsonFile();
});

test("HTML radio button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label>
        <input type="radio" name="input" value="yes" checked />
        Yes
      </label>
      <label>
        <input type="radio" name="input" value="no" />
        No
      </label>
    `,
  );
});

test("HTML file input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">File Input</label>
      <input type="file" id="input" name="input" />
    `,
  );
});

test("HTML search input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="input">Search Input</label>
      <input type="search" id="input" name="input" value="Search" />
    `,
  );
});

test("HTML textarea", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="textarea">Textarea</label>
      <textarea id="textarea" name="input">Text</textarea>
    `,
  );
});

test("HTML single select", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Single Select</label>
      <select id="select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3" disabled>Option 3</option>
      </select>
    `,
  );
});

test("HTML single select without selected attribute", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Single Select</label>
      <select id="select">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );
});

test("HTML single select with changed selection", async ({ page }) => {
  const bodyLocator = await setupSnapshotTest(
    page,
    html`
      <label for="select">Single Select</label>
      <select id="select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );

  await page.getByRole("combobox").selectOption("option2");

  await expect(rawSnapshot(bodyLocator)).toMatchJsonFile();
});

test("HTML select with option labels", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Select</label>
      <select id="select">
        <option value="option1" label="Short 1" selected>Long Option 1</option>
        <option value="option2" label="Short 2"></option>
        <option value="option3">Option 3</option>
      </select>
    `,
  );
});

test("HTML multi select", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Multi Select</label>
      <select id="select" multiple>
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3" selected>Option 3</option>
      </select>
    `,
  );
});

test("HTML multi select with input state", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Multi Select</label>
      <select id="select" multiple disabled required>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );
});

test("HTML select with size resolves to listbox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Select</label>
      <select id="select" size="3">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    `,
  );
});

test("HTML select with size 1 resolves to combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Select</label>
      <select id="select" size="1">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );
});

test("HTML select with option groups", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label for="select">Select</label>
      <select id="select">
        <option value="option1">Option 1</option>
        <optgroup label="Group 1">
          <option value="option2" selected>Option 2</option>
          <option value="option3">Option 3</option>
        </optgroup>
        <optgroup label="Group 2" disabled>
          <option value="option4">Option 4</option>
        </optgroup>
      </select>
    `,
  );
});

test("input-based combobox", async ({ page }) => {
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
          aria-expanded="false"
        />
      </label>
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
        <li role="option" aria-disabled="true">Option 3</li>
      </ul>
    `,
  );
});

test("HTML input with datalist resolves to combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label>
        Email
        <input type="email" list="emails" />
      </label>
      <datalist id="emails">
        <option value="alice@example.com"></option>
        <option value="bob@example.com"></option>
      </datalist>
    `,
  );
});

test("HTML input with datalist keeps role of non-text input types", async ({
  page,
}) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label>
        Range
        <input type="range" list="marks" min="0" max="100" value="50" />
      </label>
      <datalist id="marks">
        <option value="0"></option>
        <option value="100"></option>
      </datalist>
    `,
  );
});

test("HTML input with list referencing missing datalist", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <label>
        Browser
        <input type="text" list="missing" />
      </label>
    `,
  );
});

test("role-based combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div
        role="combobox"
        tabindex="0"
        aria-label="Combobox"
        aria-haspopup="listbox"
        aria-controls="options"
        aria-expanded="false"
      >
        Option 1
      </div>
      <ul id="options" role="listbox">
        <li role="option" aria-selected="true">Option 1</li>
        <li role="option" aria-selected="false">Option 2</li>
        <li role="option" aria-disabled="true">Option 3</li>
      </ul>
    `,
  );
});

test("role-based combobox with option groups", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <div
        role="combobox"
        tabindex="0"
        aria-label="Combobox"
        aria-haspopup="listbox"
        aria-controls="options"
        aria-expanded="false"
      >
        Option 2
      </div>
      <div id="options" role="listbox">
        <div role="option" aria-selected="false">Option 1</div>
        <div role="group" aria-label="Group 1">
          <div role="option" aria-selected="true">Option 2</div>
          <div role="option" aria-selected="false">Option 3</div>
        </div>
        <div role="group" aria-label="Group 2" aria-disabled="true">
          <div role="option" aria-selected="false">Option 4</div>
        </div>
      </div>
    `,
  );
});

test("button-based combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    html`
      <button
        type="button"
        role="combobox"
        aria-label="Combobox"
        aria-expanded="false"
      >
        Button Value
        <span aria-hidden="true">Hidden</span>
      </button>
    `,
  );
});
