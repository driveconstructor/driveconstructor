import { describe, expect, test } from "@jest/globals";
import { findVoltageY } from "../voltage";
import { filters } from "../filter-component";
import { findFcVoltageY } from "../fconverter-voltage";
describe("sizingn utilities", () => {
  test("voltage", () => {
    const v1 = findVoltageY(400);
    expect(v1.min).toBeCloseTo(360);
    expect(v1.max).toBeCloseTo(440);
  });

  test("filters", () => {
    expect(filters).toHaveLength(138);
  });

  test("fc voltage", () => {
    const v1 = findFcVoltageY(400);
    expect(v1.min).toBeCloseTo(360);
    expect(v1.max).toBeCloseTo(420);
    expect(v1.type).toBe("LV");

    const v2 = findFcVoltageY(1000);
    expect(v2.min).toBeCloseTo(594);
    expect(v2.max).toBeCloseTo(693);
    expect(v2.type).toBe("LV");

    const v3 = findFcVoltageY(5000);
    expect(v3.min).toBeCloseTo(3744);
    expect(v3.max).toBeCloseTo(4368);
    expect(v3.value).toBeCloseTo(4160);
    expect(v3.type).toBe("MV1");

    const v4 = findFcVoltageY(50000);
    expect(v4.value).toBe(11000);
    expect(v4.type).toBe("MV2");
  });
});
