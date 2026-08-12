import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

for (const topology of ["wind-gb-fc", "wind-gb-fc-tr"] as const) {
  test(`DFIM defaults produce matches in ${topology}`, async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("wind").click();
    await page.getByTestId(topology).click();

    await page.getByTestId("emachine.<icon>").click();
    await page.getByLabel("Type:").selectOption("DFIM");

    await expect(page.getByTestId("gearbox[0].numberOfStages")).toContainText(
      "2",
    );
    await expect(page.getByTestId("gearbox[0].gearRatio")).toContainText("64");
    await expect(page.getByTestId("emachine[0].designation")).toContainText(
      "DF-",
    );

    await page.getByTestId("emachine[0].<selected>").check();
    await expect(page.getByTestId("cable[0].designation")).toBeVisible();
    await expect(page.getByTestId("fconverter[0].designation")).toContainText(
      "4Q-",
    );
    await page.getByTestId("fconverter[0].<selected>").check();
    if (topology == "wind-gb-fc-tr") {
      await expect(page.getByTestId("trafo[0].designation")).toBeVisible();
    }

    const exportActions = page.getByTestId("dfim-export-actions");
    await expect(exportActions).toBeVisible();
    await expect(
      exportActions.getByRole("button", { name: "Parameters CSV" }),
    ).toBeVisible();
    await expect(
      exportActions.getByRole("button", { name: "MATLAB script" }),
    ).toBeVisible();
    await expect(
      exportActions.getByRole("button", { name: "Simulink model" }),
    ).toBeVisible();
  });
}

test("DFIM derives the 2.1 MW operating point from turbine inputs", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("wind").click();
  await page.getByTestId("wind-gb-fc").click();

  await page.getByTestId("emachine.<icon>").click();
  await page.getByLabel("Type:").selectOption("DFIM");
  await page.getByTestId("wind.<icon>").click();

  await expect(page.getByLabel("Rotor diameter, m:")).toHaveValue("75");
  await expect(page.getByLabel("Rated wind speed, m/s:")).toHaveValue("12");

  await page.getByLabel("Rotor diameter, m:").fill("75");
  await page.getByLabel("Rotor diameter, m:").press("Tab");
  await page.getByLabel("Rated wind speed, m/s:").fill("12");
  await page.getByLabel("Rated wind speed, m/s:").press("Tab");
  await page.getByRole("button", { name: "More..." }).first().click();

  await expect(page.getByLabel("Power on shaft, kW:")).toHaveValue("2104.1");
  await expect(page.getByLabel("Rated speed of the blades, rpm:")).toHaveValue(
    "21",
  );
  await expect(page.getByLabel("Rated torque, kNm:")).toHaveValue("939");
  await expect(page.getByTestId("emachine[0].ratedPower")).toContainText(
    "2500",
  );
});

test("DFIM export actions fit a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByTestId("wind").click();
  await page.getByTestId("wind-gb-fc").click();
  await page.getByTestId("emachine.<icon>").click();
  await page.getByLabel("Type:").selectOption("DFIM");
  await page.getByTestId("emachine[0].<selected>").check();
  await page.getByTestId("fconverter[0].<selected>").check();

  const panel = page.getByTestId("dfim-export-actions");
  await expect(panel).toBeVisible();
  const panelBox = await panel.boundingBox();
  expect(panelBox).not.toBeNull();
  expect(panelBox!.x).toBeGreaterThanOrEqual(0);
  expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(390);

  for (const button of await panel.getByRole("button").all()) {
    const buttonBox = await button.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(buttonBox!.x).toBeGreaterThanOrEqual(panelBox!.x);
    expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(
      panelBox!.x + panelBox!.width,
    );
  }
});

test("DFIM export actions return the requested files", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("wind").click();
  await page.getByTestId("wind-gb-fc").click();
  await page.getByTestId("emachine.<icon>").click();
  await page.getByLabel("Type:").selectOption("DFIM");
  await page.getByTestId("emachine[0].<selected>").check();
  await page.getByTestId("fconverter[0].<selected>").check();

  const panel = page.getByTestId("dfim-export-actions");
  const exports = [
    ["Parameters CSV", "Parameters.csv"],
    ["MATLAB script", "dfim_vindturbin_script.m"],
    ["Simulink model", "DFIM_vindturbin_model.slx"],
  ] as const;

  for (const [buttonName, fileName] of exports) {
    const downloadPromise = page.waitForEvent("download");
    await panel.getByRole("button", { name: buttonName }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe(fileName);
    expect(await download.failure()).toBeNull();
    const downloadedPath = await download.path();
    expect(downloadedPath).not.toBeNull();
    expect((await readFile(downloadedPath!)).byteLength).toBeGreaterThan(0);
  }
});
