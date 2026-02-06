import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML text input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Text Input</label>
      <input
        type="text"
        id="input"
        name="input"
        value="Text"
      />
    `,
  );
});

test("HTML email input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Email Input</label>
      <input
        type="email"
        id="input"
        name="input"
        value="mail@example.com"
      />
    `,
  );
});

test("HTML password input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Password Input</label>
      <input
        type="password"
        id="input"
        name="input"
        value="secret"
      />
    `,
  );
});

test("HTML number input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
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
    `
      <label for="input">Range Input</label>
      <input
        type="range"
        id="input"
        name="input"
        value="0"
        min="0"
        max="100"
      />
    `,
  );
});

test("HTML date input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Date Input</label>
      <input
        type="date"
        id="input"
        name="input"
        value="2020-06-15"
      />
    `,
  );
});

test("HTML time input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Time Input</label>
      <input
        type="time"
        id="input"
        name="input"
        value="12:00"
      />
    `,
  );
});

test("HTML checkbox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label>
        <input
          type="checkbox"
          name="input"
          checked
        />
        Checked
      </label>
      <label>
        <input
          type="checkbox"
          name="input"
        />
        Unchecked
      </label>
    `,
  );
});

test("HTML radio button", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
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
    `
      <label for="input">File Input</label>
      <input type="file" id="input" name="input" />
    `,
  );
});

test("HTML search input", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="input">Search Input</label>
      <input type="search" id="input" name="input" value="Search" />
    `,
  );
});

test("HTML textarea", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="textarea">Textarea</label>
      <textarea id="textarea" name="input">Text</textarea>
    `,
  );
});

test("HTML single select", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="select">Single Select</label>
      <select id="select">
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    `,
  );
});

test("HTML multi select", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <label for="select">Multi Select</label>
      <select id="select" multiple>
        <option value="option1" selected>Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3" selected>Option 2</option>
      </select>
    `,
  );
});

test("input-based combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
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
      </ul>
    `,
  );
});

test("button-based combobox", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <button
        type="button"
        role="combobox"
        aria-label="Combobox"
        aria-expanded="false"
      >
        Button Value
      </button>
    `,
  );
});
