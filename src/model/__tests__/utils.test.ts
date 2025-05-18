import { describe, expect, test } from "@jest/globals";
import { CrossSection } from "../cable";
import { ShaftHeight } from "../emachine";
import { splitRange } from "../utils";

describe("utils", () => {
  test("parse range type", () => {
    expect(splitRange("123-456")).toStrictEqual({ min: 123, max: 456 });
    expect(() => splitRange("123-a")).toThrow();
  });
  test("shaft height down", () => {
    expect(ShaftHeight.findLast((v) => v <= 210)).toBe(200);
    expect(ShaftHeight.findLast((v) => v <= 396)).toBe(355);
  });
  test("shaft height up", () => {
    expect(CrossSection.find((v) => v >= 121.5)).toBe(150);
  });
});
