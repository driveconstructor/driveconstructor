import { describe, expect, test } from "@jest/globals";
import { findVoltageY } from "../voltage";
import { filters } from "../filter-component";
describe("sizingn utilities", () => {
  test("voltage", () => {
    const v1 = findVoltageY(400);
    expect(v1.min).toBeCloseTo(360);
    expect(v1.max).toBeCloseTo(440);
  });

  test("filters", () => {
    expect(filters).toHaveLength(138);
  });
});
