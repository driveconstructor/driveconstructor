import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("wind").click();
  await page.getByTestId("wind-fc").click();
});

test("Defaults", async ({ page }) => {
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-15-LV-400-SH315-ACS-IP2x-CI-100-B3-IE4",
  );
  await expect(page.getByTestId("emachine[1].designation")).toContainText(
    "PM-22-LV-400-SH250-ACS-IP2x-CI-200-B3-IE4",
  );
  await page.getByTestId("emachine[1].<selected>").check();
  await expect(page.getByTestId("cable[0].designation")).toContainText(
    "CU-3x003-01kV",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-15-IP2x-AC-W-6p",
  );
});
