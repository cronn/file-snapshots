import test from "@playwright/test";

import { matchRawElementSnapshot } from "../../src/test/fixtures";

test("HTML fieldset", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <fieldset>
        <legend>Legend</legend>
        <label for="firstName">First Name</label>
        <input type="text" name="firstName" id="firstName" />
        <label for="lastName">Last Name</label>
        <input type="text" name="lastName" id="lastName" />
      </fieldset>
    `,
  );
});

test("role-based group", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="menu">
        <ul role="group" aria-label="Actions">
          <li role="menuitem">Edit</li>
          <li role="menuitem">Delete</li>
        </ul>
        <ul role="group">
          <li role="menuitem">Help</li>
        </ul>
      </div>
    `,
  );
});

test("role-based-group without name", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <div role="group">
        <label for="firstName">First Name</label>
        <input type="text" name="firstName" id="firstName" />
        <label for="lastName">Last Name</label>
        <input type="text" name="lastName" id="lastName" />
      </div>
    `,
  );
});

test("radiogroup", async ({ page }) => {
  await matchRawElementSnapshot(
    page,
    `
      <h2 id="label">Radiogroup Name</h2>
      <div
        role="radiogroup"
        aria-labelledby="label"
        aria-describedBy="description"
      >
        <p id="description">Radiogroup Description</p>
        <label>
          <input type="radio" name="radio" value="option-1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="radio" value="option-2" />
          Option 2
        </label>
      </div>
    `,
  );
});
