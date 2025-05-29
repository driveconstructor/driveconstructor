import { expect, test } from "@playwright/test";
import path from "path";

test.beforeEach(async ({ browserName, page }) => {
  await page.goto("/");

  await page.getByTestId("pump").click();
  await page.getByTestId("pump-fc").click();
  page.on("dialog", (dialog) => dialog.accept());
  // for some reason dialogs are not working im chromium
  test.skip(browserName.toLowerCase() != "firefox", "Test only for firefox!");
});

test("report and my-systems", async ({ page }) => {
  await expect(page.getByTestId("system-name")).toContainText("Unsaved draft");
  await page.getByTestId("fconverter[0].<selected>").check();
  await page.getByTestId("save").click();
  await expect(page.getByTestId("system-name")).toContainText(
    "New pump system",
  );
  await page.getByRole("button", { name: "Show report" }).click();
  await expect(page.getByTestId("price")).toContainText("37892");
  await expect(page.getByTestId("efficiency100")).toContainText("94.3");
  await expect(page.getByTestId("efficiency75")).toContainText("94.17");
  await expect(page.getByTestId("efficiency50")).toContainText("92.4");
  await expect(page.getByTestId("efficiency25")).toContainText("87.13");
  await expect(page.getByTestId("volume")).toContainText("0.4413");
  await expect(page.getByTestId("footprint")).toContainText("1.041");
  await expect(page.getByTestId("weight")).toContainText("1044.64");
  await expect(page.getByTestId("thdU")).toContainText("N/A");
  await expect(page.getByTestId("thdI")).toContainText("N/A");
  await expect(page.getByTestId("emachine[designation]")).toContainText(
    "IM-132-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
  );
  await expect(page.getByTestId("cable[designation]")).toContainText(
    "CU-3x150-01kV",
  );
  await expect(page.getByTestId("fconverter[designation]")).toContainText(
    "2Q-2L-400-160-IP2x-AC-W-6p",
  );
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByTestId("go-back-link").click();
  await page.getByTestId("fconverter[1].label.<selected>").click();
  await page.getByRole("link", { name: "My systems" }).click();
  await page.getByTestId("system[0].<duplicate>").click();
  await expect(page.getByTestId("system[0].<name>")).toContainText(
    "New pump system copy",
  );
  await expect(page.getByTestId("system[1].<name>")).toContainText(
    "New pump system",
  );
  await expect(page.getByTestId("system[0][price]")).toContainText("42089");
  await page.getByTestId("system[1].<edit>").click();
  await page.getByTestId("fconverter[0].<selected>").check();
  await page.getByRole("link", { name: "My systems" }).click();
  await expect(page.getByTestId("system[0][price]")).toContainText("37892");
  await expect(page.getByTestId("system[1][price]")).toContainText("42089");
  await page.getByTestId("system[0].<select>").check();
  await page.getByTestId("system[1].<select>").check();
  await expect(page.getByRole("main")).toContainText(
    "Parameter selection (minimum 3)",
  );
});

test("export", async ({ page }) => {
  await page.getByRole("link", { name: "My systems" }).click();
  await page
    .getByTestId("import")
    .setInputFiles([path.join(__dirname, "test.my-systems.json")]);

  await expect(page.getByTestId("system[0].<name>")).toContainText(
    "Test pump system 1",
  );
  await expect(page.getByTestId("system[0][price]")).toContainText("37892");
  await page.getByTestId("system[0].<duplicate>").click();
  await expect(page.getByTestId("system[0].<name>")).toContainText(
    "Test pump system 1 copy",
  );
  page.reload();
  await expect(page.getByTestId("system[0].<name>")).toContainText(
    "Test pump system 1 copy",
  );
  await page.getByTestId("system[0].<select>").check();
  await page.getByTestId("system[1].<select>").check();
  await expect(page.getByRole("main")).toContainText(
    "Parameter selection (minimum 3)",
  );
});
