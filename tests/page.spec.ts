import { expect, test } from "@playwright/test";

test("CSS is working", async ({ browserName, page }) => {
  // for some reason CSS is not computed on firefox
  test.skip(
    browserName.toLowerCase() !== "chromium",
    "Test only for chromium!",
  );

  await page.goto("/");
  const label = page.getByRole("link", { name: "DriveConstructor" });
  await label.hover();
  const backgroundColor = await label.evaluate(
    (l) => getComputedStyle(l).backgroundColor,
  );
  expect(backgroundColor).toBe("lab(96.286 -0.852436 -2.46847)");
});
