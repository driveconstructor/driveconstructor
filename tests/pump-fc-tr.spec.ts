import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("pump").click();
  await page.getByTestId("pump-fc-tr").click();

  await expect(page.getByRole("main")).toContainText(
    "Drive train with voltage step down",
  );
});

test("Defaults", async ({ page }) => {});

test("Change voltage", async ({ page }) => {});
