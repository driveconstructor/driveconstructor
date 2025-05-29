import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("pump").click();
  await page.getByTestId("pump-fc-tr").click();

  await expect(page.getByRole("main")).toContainText(
    "Drive train with voltage step down",
  );
});

test("Defaults", async ({ page }) => {
  await expect(page.getByTestId("emachine[0].designation")).toContainText(
    "IM-132-LV-660-SH280-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-660-160-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-660-200-IP2x-AC-F-6p",
  );
  await expect(page.getByTestId("trafo[0].designation")).toContainText(
    "D-S-00190-06600-AC-IP5x",
  );
  await expect(page.getByTestId("trafo[0].voltageLVmax")).toContainText("700");
  await expect(page.getByTestId("trafo[0].voltageHVmax")).toContainText("6600");
  await expect(page.getByTestId("trafo[0].currentHVmax")).toContainText(
    "16.62",
  );
  await expect(page.getByTestId("trafo[0].currentLVmax")).toContainText(
    "156.71",
  );
  await expect(page.getByTestId("trafo[0].efficiency100")).toContainText(
    "98.01",
  );
  await expect(page.getByTestId("trafo[0].ratedPower")).toContainText("190");
  await expect(page.getByTestId("trafo[0].typeII")).toContainText("dry");
  await expect(page.getByTestId("trafo[0].typeIII")).toContainText("2-winding");
  await expect(page.getByTestId("trafo[0].typeIV")).toContainText(
    "stand-alone",
  );
  await expect(page.getByTestId("trafo[0].cooling")).toContainText("air");
  await expect(page.getByTestId("trafo[0].protection")).toContainText(
    "IP54/55",
  );
  await expect(page.getByTestId("trafo[0].weight")).toContainText("909.7");
  await expect(page.getByTestId("trafo[0].height")).toContainText("1.26");
  await expect(page.getByTestId("trafo[0].width")).toContainText("1.05");
  await expect(page.getByTestId("trafo[0].price")).toContainText("6025");
  await expect(page.getByTestId("trafo[0].depth")).toContainText("0.6976");
  await expect(page.getByTestId("trafo[0].designation")).toContainText(
    "D-S-00190-06600-AC-IP5x",
  );
  await page.getByTestId("trafo.<icon>").click();
  await page.getByText("More...").first().click();
  await page
    .getByLabel("Integrated or stand-alone:")
    .selectOption("integrated");
  await expect(page.getByLabel("Windings:")).toHaveValue("multi-winding");
  await expect(page.getByTestId("trafo[0].typeIII")).toContainText(
    "multi-winding",
  );
  await page.getByTestId("trafo[0].designation").click();
  await expect(page.getByTestId("trafo[0].designation")).toContainText(
    "D-I-00190-06600-AC-IP5x",
  );
});

test("Change voltage", async ({ page }) => {
  await page.getByTestId("trafo.<icon>").click();
  await page.getByLabel("Voltage (LV):").selectOption("2200-2550");
  await expect(page.getByTestId("fconverter[0].designation")).toContainText(
    "2Q-2L-2460-132-IP2x-AC-W-6p",
  );
  await expect(page.getByTestId("fconverter[1].designation")).toContainText(
    "2Q-2L-2460-200-IP2x-AC-F-6p",
  );
  await expect(page.getByTestId("trafo[0].designation")).toContainText(
    "D-S-00175-06600-AC-IP5x",
  );
});
