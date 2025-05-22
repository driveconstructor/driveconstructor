import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("pump").click();
  await page.getByTestId("pump-fc").click();
  await expect(page.getByText("Drive train with just")).toBeVisible();
});

test("Defaults", async ({ page }) => {
  await expect(page.getByLabel("Type:")).toHaveValue("centrifugal");
  await expect(page.getByLabel("Head, m:")).toHaveValue("200");
  await expect(page.getByLabel("Rated speed, rpm:")).toHaveValue("1450");
  await expect(page.getByLabel("Minimal speed, rpm:")).toHaveValue("0");
  await expect(page.getByLabel("Rated efficiency, %:")).toHaveValue("81");

  await expect(page.getByTestId("emachine[0].type")).toContainText("SCIM");
  await expect(page.getByTestId("emachine[0].price")).toContainText("25093");
  await expect(page.getByTestId("emachine[0].ratedPower")).toContainText("132");
  await expect(page.getByTestId("emachine[0].ratedVoltageY")).toContainText(
    "360-440",
  );
  await expect(page.getByTestId("emachine[0].efficiency100")).toContainText(
    "96.7",
  );
  await expect(page.getByTestId("emachine[0].ratedCurrent")).toContainText(
    "258",
  );
  await expect(page.getByTestId("emachine[0].cooling")).toContainText("IC411");
  await expect(page.getByTestId("emachine[0].protection")).toContainText(
    "IP21/23",
  );
  await expect(page.getByTestId("emachine[0].frameMaterial")).toContainText(
    "cast iron",
  );
  await expect(page.getByTestId("emachine[0].volume")).toContainText("0.27");
  await expect(page.getByTestId("emachine[0].footprint")).toContainText("0.62");
  await expect(page.getByTestId("emachine[0].weight")).toContainText("961");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-132-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("emachine[0].<selected>")).toBeChecked();
  await page.getByTestId("emachine.<more>").click();
  await expect(page.getByTestId("emachine[0].shaftHeight")).toContainText(
    "280",
  );
  await expect(page.getByTestId("emachine[0].cosFi50")).toContainText("0.6876");
  await expect(page.getByTestId("emachine[0].momentOfInertia")).toContainText(
    "5.01",
  );
  await expect(page.getByTestId("emachine[0].footprint")).toContainText("0.62");

  await expect(page.getByTestId("cable[0].length")).toContainText("30");
  await expect(page.getByTestId("cable[0].price")).toContainText("1021");
  await expect(page.getByTestId("cable[0].numberOfRuns")).toContainText("1");
  await expect(page.getByTestId("cable[0].crossSection")).toContainText("150");
  await expect(page.getByTestId("cable[0].material")).toContainText("copper");
  await expect(page.getByTestId("cable[0].voltage")).toContainText("1");
  await expect(page.getByTestId("cable[0].reactancePerHz")).toContainText(
    "0.004477",
  );
  await expect(page.getByTestId("cable[0].resistancePerMeter")).toContainText(
    "0.0001288",
  );
  await expect(page.getByTestId("cable[0].pricePerMeter")).toContainText(
    "34.03",
  );
  await expect(page.getByTestId("cable[0].designation")).toContainText(
    "CU-3x150-01kV",
  );
  await expect(page.getByTestId("cable[0].voltageDrop")).toContainText("1.83");
  await expect(page.getByTestId("cable[0].losses")).toContainText("0.65");
  await expect(page.getByTestId("cable[0].efficiency100")).toContainText(
    "99.51",
  );

  await expect(page.getByTestId("cable[0].<selected>")).toBeChecked();
  await expect(page.getByTestId("cable[0].resistancePerMeter")).toContainText(
    "0.0001288",
  );
  await expect(page.getByTestId("cable[0].reactancePerHz")).toContainText(
    "0.004477",
  );

  await expect(page.getByTestId("fconverter[0].<selected>")).not.toBeChecked();
  await expect(page.getByTestId("fconverter[1].<selected>")).not.toBeChecked();

  await expect(page.getByTestId("fconverter[0].type")).toContainText(
    "2Q-2L-VSC-6p",
  );
  await expect(page.getByTestId("fconverter[0].price")).toContainText("8990");
  await expect(page.getByTestId("fconverter[0].ratedPower")).toContainText(
    "160",
  );
  await expect(page.getByTestId("fconverter[0].voltage")).toContainText(
    "360-420",
  );
  await expect(page.getByTestId("fconverter[0].workingVoltage")).toContainText(
    "400",
  );
  await expect(page.getByTestId("fconverter[0].cooling")).toContainText("air");
  await expect(page.getByTestId("fconverter[0].efficiency100")).toContainText(
    "98",
  );
  await expect(page.getByTestId("fconverter[0].mounting")).toContainText(
    "wall",
  );
  await expect(page.getByTestId("fconverter[0].height")).toContainText("1");
  await expect(page.getByTestId("fconverter[0].width")).toContainText("0.42");
  await expect(page.getByTestId("fconverter[0].depth")).toContainText("0.4");
  await expect(page.getByTestId("fconverter[0].volume")).toContainText(
    "0.1666",
  );
  await expect(page.getByTestId("fconverter[0].footprint")).toContainText(
    "0.4165",
  );
  await expect(page.getByTestId("fconverter[0].weight")).toContainText("83.3");
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-160-IP2x-AC-W-6p",
  );

  await page.getByTestId("fconverter[1].<selected>").check();
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );
  await page.getByTestId("fconverter.<more>").click();
  await expect(page.getByTestId("fconverter[0].footprint")).toContainText(
    "0.4165",
  );
  await expect(page.getByTestId("fconverter[1].footprint")).toContainText(
    "0.3471",
  );
});

test("Centrifugal vs Positive displacement", async ({ page }) => {
  await page.getByLabel("Type:").selectOption("positive displacement");
  await page.getByTestId("emachine.<icon>").click();
  await page.getByLabel("Cooling:").selectOption("IC71W");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-132-LV-400-SH250-WC-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-160-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );
});

test("Minimum speed in Positive displacement pump", async ({ page }) => {
  await page.getByLabel("Type:").selectOption("positive displacement");
  //TODO: fix motor selection when minimal speed is 0

  await page
    .getByRole("spinbutton", { name: "Minimal speed, rpm:" })
    .fill("500");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-160-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("cable[0].designation")).toContainText(
    "CU-3x150-01kV",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-160-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );

  await page
    .getByRole("spinbutton", { name: "Minimal speed, rpm:" })
    .fill("300");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-200-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-160-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );
});

test("Starting torque", async ({ page }) => {
  await page.getByTestId("emachine.<icon>").click();
  await page.getByLabel("Type:").selectOption("PMSM");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-132-LV-400-SH250-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-132-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );
  await page.getByTestId("pump.<icon>").click();
  await page.getByText("More...").first().click();
  await page.getByLabel("Starting torque as *T_rated:").selectOption("2.0");

  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-200-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-132-IP2x-AC-W-6p",
  );
  await page.getByLabel("Starting torque as *T_rated:").selectOption("1.6");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "PM-160-LV-400-SH250-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-132-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-400-200-IP2x-AC-F-6p",
  );
});

test("Fluid density", async ({ page }) => {
  await page.getByText("More...").first().click();
  await page.getByRole("spinbutton", { name: "Fluid:" }).fill("2000");
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-250-LV-400-SH315-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-400-315-IP2x-AC-F-6p",
  );
  await expect(page.getByTestId("fconverter[0].<selected>")).toBeChecked();
});

test("Influence of cable length", async ({ page }) => {
  // TODO: implement
});
