import { expect, test } from "@playwright/test";

test("PumpFc", async ({ page }) => {
  await page.goto("localhost:8000");

  await page.getByText("Pumps").locator("..").getByText("Select").click();
  await page
    .getByText(/Drive train with just variable speed drive/)
    .locator("..")
    .getByText("New System")
    .click();

  expect(await page.getByLabel("Type").inputValue()).toBe("centrifugal");
});
