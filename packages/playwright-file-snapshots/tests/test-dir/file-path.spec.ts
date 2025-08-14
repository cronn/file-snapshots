import { test } from "@playwright/test";

import { defineValidationFileExpect } from "../../src";

const expect = defineValidationFileExpect();

test.describe("describe title", () => {
  test("test title", async () => {
    await test.step("step with single assertion", async () => {
      await expect("value").toMatchTextFile();
    });

    await test.step("step with multiple assertions", async () => {
      await expect("value 1").toMatchTextFile({ name: "snapshot 1" });
      await expect("value 2").toMatchTextFile({ name: "snapshot 2" });
    });

    await test.step("step with nested step", async () => {
      await test.step("nested step", async () => {
        await expect("value").toMatchTextFile();
      });
    });

    await expect("value").toMatchTextFile();
  });
});
