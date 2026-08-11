import { expect, test } from "@playwright/test";

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
