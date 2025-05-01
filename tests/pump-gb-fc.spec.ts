import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("pump").click();
  await page.getByTestId("pump-gb-fc").click();
  await expect(page.getByRole("main")).toContainText(
    "Drive train with speed gearing",
  );
});

test("Defaults", async ({ page }) => {
  await expect(page.getByTestId("gearbox[0].inputTorque")).toContainText("12");
  await expect(page.getByTestId("gearbox[0].torque")).toContainText("3.96");
  await expect(page.getByTestId("gearbox[0].numberOfStages")).toContainText(
    "1",
  );
  await expect(page.getByTestId("gearbox[0].stage1Ratio")).toContainText("3");
  await expect(page.getByTestId("gearbox[0].stage1Type")).toContainText(
    "helical",
  );
  await expect(page.getByTestId("gearbox[0].gearRatio")).toContainText("3");
  await expect(page.getByTestId("gearbox[0].efficiency100")).toContainText(
    "99",
  );
  await expect(page.getByTestId("gearbox[0].efficiency75")).toContainText("99");
  await expect(page.getByTestId("gearbox[0].efficiency50")).toContainText("98");
  await expect(page.getByTestId("gearbox[0].efficiency25")).toContainText("97");
  await expect(page.getByTestId("gearbox[0].weight")).toContainText("332.59");
  await expect(page.getByTestId("gearbox[0].length")).toContainText("0.61");
  await expect(page.getByTestId("gearbox[0].height")).toContainText("0.73");
  await expect(page.getByTestId("gearbox[0].width")).toContainText("0.51");
  await expect(page.getByTestId("gearbox[0].price")).toContainText("19113.72");
  await expect(page.getByTestId("gearbox[0].designation")).toContainText("H-3");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-250-LV-400-SH400-ACS-IP2x-CI-500-B3-IE4",
  );
  await expect(page.getByTestId("emachine[1].designation")).toContainText(
    "IM-250-LV-400-SH355-ACS-IP2x-CI-600-B3-IE4",
  );
  await page.getByTestId("emachine[0].<selected>").check();
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-160-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );
});

test("2 helial stages", async ({ page }) => {
  await page.getByTestId("gearbox.<icon>").click();
  await page.getByLabel("Number of stages:").selectOption("2");
  await expect(page.getByTestId("gearbox[0].price")).toContainText("29674.59");
  await expect(page.getByTestId("gearbox[0].designation")).toContainText(
    "H-H-9",
  );
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-132-LV-400-SH315-ACS-IP2x-CI-750-B3-IE4",
  );
  await expect(page.getByTestId("emachine[1].designation")).toContainText(
    "IM-160-LV-400-SH315-ACS-IP2x-CI-1000-B3-IE4",
  );
  await expect(page.getByTestId("emachine[2].designation")).toContainText(
    "IM-250-LV-400-SH315-ACS-IP2x-CI-1500-B3-IE4",
  );
});
