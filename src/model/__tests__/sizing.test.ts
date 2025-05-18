import { describe, expect, test } from "@jest/globals";
import { findFcVoltageY } from "../fconverter-voltage";
import { filters } from "../filter-component";
import { findVoltageY } from "../voltage";
describe("sizing utilities", () => {
  test("voltage", () => {
    expect(findVoltageY(400)).toStrictEqual({
      min: 360,
      max: 440,
      type: "LV",
      value: 400,
    });
    expect(findVoltageY(1000)).toBeDefined();

    expect(findVoltageY(4000)).toStrictEqual({
      max: 7260,
      min: 5940,
      type: "MV",
      value: 6600,
    });
    expect(findFcVoltageY(12000)).toBeNull();

    expect(findVoltageY(100)?.value).toBe(400);
    expect(findVoltageY(400)?.value).toBe(400);
    expect(findVoltageY(405)?.value).toBe(400);
    expect(findVoltageY(450)?.value).toBe(660);
    expect(findVoltageY(600)?.value).toBe(660);
    expect(findVoltageY(1000)?.value).toBe(3300);
    expect(findVoltageY(3000)?.value).toBe(3300);
    expect(findVoltageY(12000)?.value).toBeUndefined();
  });

  test("filters", () => {
    expect(filters).toHaveLength(138);
  });

  test("fc voltage", () => {
    expect(findFcVoltageY(400)).toStrictEqual({
      min: 360,
      max: 420,
      type: "LV",
      value: 400,
    });
    expect(findFcVoltageY(1000)).toBeNull();

    expect(findFcVoltageY(4000)).toStrictEqual({
      max: 4368,
      min: 3744,
      type: "MV1",
      value: 4160,
    });
    expect(findFcVoltageY(4200)).toBeNull();

    expect(findFcVoltageY(6005)).toStrictEqual({
      max: 6930,
      min: 5940,
      type: "MV2",
      value: 6600,
    });

    expect(findFcVoltageY(12000)).toBeNull();
  });
});
