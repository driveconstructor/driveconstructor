import { expect, test } from "@playwright/test";

test("Drive train with just variable speed drive (default)", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Select" }).first().click();
  await page.getByRole("button", { name: "New System" }).first().click();

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
});
