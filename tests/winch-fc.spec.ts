import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("winch").click();
  await page.getByTestId("winch-fc").click();
});

test("Defaults", async ({ page }) => {
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-55-LV-400-SH315-ACS-IP2x-CI-200-B3-IE4",
  );
  await expect(page.getByTestId("emachine[1].designation")).toContainText(
    "PM-90-LV-400-SH315-ACS-IP2x-CI-300-B3-IE4",
  );
  await page.getByTestId("emachine[0].<selected>").check();
  await expect(page.getByTestId("cable[0].designation")).toContainText(
    "CU-3x025-01kV",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-55-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("emachine[0].price")).toContainText("61013");
  await expect(page.getByTestId("emachine[0].weight")).toContainText("1682.99");
  await expect(page.getByTestId("fconverter[0].price")).toContainText("3438");
  await expect(page.getByTestId("fconverter[0].weight")).toContainText("28.63");
});
