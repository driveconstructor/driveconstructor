import { expect, test } from "@playwright/test";

const chapters = [
  {
    path: "/docs/textbook/components/electric-machines/",
    heading: "Electric machines",
    text: "Doubly Fed Induction Machine",
  },
  {
    path: "/docs/textbook/components/frequency-converters/",
    heading: "Frequency converters",
    text: "maximum absolute slip of 30%",
  },
  {
    path: "/docs/textbook/components/gearboxes/",
    heading: "Gearboxes",
  },
  {
    path: "/docs/textbook/components/transformers/",
    heading: "Transformers",
  },
  {
    path: "/docs/textbook/components/power-cables/",
    heading: "Power cables",
    text: "combined stator and rotor loss",
  },
] as const;

for (const chapter of chapters) {
  test(`${chapter.heading} chapter renders`, async ({ page }) => {
    await page.goto(chapter.path);
    await expect(
      page.getByRole("heading", { name: chapter.heading, exact: true }),
    ).toBeVisible();
    if ("text" in chapter) {
      await expect(
        page.getByText(chapter.text, { exact: false }),
      ).toBeVisible();
    }
    await expect(page.locator('img[alt^="doc-"]').first()).toBeVisible();
  });
}
