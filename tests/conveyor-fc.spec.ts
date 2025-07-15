import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("conveyor").click();
  await page.getByTestId("conveyor-fc").click();

  await expect(page.getByRole("main")).toContainText(
    "Drive train with just variable speed drive",
  );
});

test("Defaults", async ({ page }) => {
  await expect(page.getByLabel("Rated torque, kNm:")).toHaveValue("10");
  await expect(page.getByLabel("Max speed, rpm:")).toHaveValue("100");
  await expect(page.getByLabel("Min speed, rpm:")).toHaveValue("50");
  await expect(page.getByLabel("Duty, %:")).toHaveValue("100");
  await expect(page.getByLabel("Duty cycle period, min:")).toHaveValue("1");
  await expect(page.getByLabel("Overload duration, sec:")).toHaveValue("10");
  await expect(page.getByLabel("Overload amplitude, %:")).toHaveValue("20");
  await expect(page.getByLabel("Overload cycle period, sec:")).toHaveValue(
    "60",
  );

  await expect(page.getByTestId("emachine[0].type")).toContainText("PMSM");
  await expect(page.getByTestId("emachine[0].price")).toContainText("187794");
  await expect(page.getByTestId("emachine[0].ratedPower")).toContainText("110");
  await expect(page.getByTestId("emachine[0].ratedSpeed")).toContainText("100");
  await expect(page.getByTestId("emachine[0].ratedVoltageY")).toContainText(
    "360-440",
  );
  await expect(page.getByTestId("emachine[0].efficiency100")).toContainText(
    "97.16",
  );
  await expect(page.getByTestId("emachine[0].ratedCurrent")).toContainText(
    "172",
  );
  await expect(page.getByTestId("emachine[0].cooling")).toContainText("IC411");
  await expect(page.getByTestId("emachine[0].protection")).toContainText(
    "IP21/23",
  );
  await expect(page.getByTestId("emachine[0].frameMaterial")).toContainText(
    "cast iron",
  );
  await expect(page.getByTestId("emachine[0].volume")).toContainText("1.7418");
  await expect(page.getByTestId("emachine[0].footprint")).toContainText(
    "2.2177",
  );
  await expect(page.getByTestId("emachine[0].weight")).toContainText("6096.2");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-110-LV-400-SH500-ACS-IP2x-CI-100-B3-IE4",
  );

  await page.getByRole("spinbutton", { name: "Rated torque, kNm:" }).fill("20");

  await expect(page.getByTestId("emachine[0].price")).toContainText("318749");
  await expect(page.getByTestId("emachine[0].ratedPower")).toContainText("250");
  await expect(page.getByTestId("emachine[0].ratedSpeed")).toContainText("100");
  await expect(page.getByTestId("emachine[0].efficiency100")).toContainText(
    "97.67",
  );
  await expect(page.getByTestId("emachine[0].ratedCurrent")).toContainText(
    "389",
  );
  await expect(page.getByTestId("emachine[0].volume")).toContainText("3.3591");
  await expect(page.getByTestId("emachine[0].footprint")).toContainText(
    "3.3944",
  );
  await expect(page.getByTestId("emachine[0].weight")).toContainText(
    "11757.01",
  );
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-250-LV-400-SH630-ACS-IP2x-CI-100-B3-IE4",
  );

  await page.getByRole("spinbutton", { name: "Max speed, rpm:" }).fill("200");

  await expect(page.getByTestId("emachine[0].price")).toContainText("284895");
  await expect(page.getByTestId("emachine[0].ratedPower")).toContainText("630");
  await expect(page.getByTestId("emachine[0].ratedSpeed")).toContainText("200");
  await expect(page.getByTestId("emachine[0].efficiency100")).toContainText(
    "94.83",
  );
  await expect(page.getByTestId("emachine[0].ratedCurrent")).toContainText(
    "1009",
  );
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-630-LV-400-SH630-ACS-IP2x-CI-200-B3-IE4",
  );

  // Check that min speed automatically adjusted
  await expect(page.getByLabel("Min speed, rpm:")).toHaveValue("40");

  // Change duty cycle from 100% to 80%
  await page.getByLabel("Duty, %:").selectOption("80");

  // With lower duty cycle, should still get same motor selection
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-630-LV-400-SH630-ACS-IP2x-CI-200-B3-IE4",
  );

  await page.getByTestId("emachine[0].<selected>").click();
  await page.getByTestId("fconverter[0].<selected>").click();

  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-630-IP2x-AC-F-6p",
  );
});
