import { describe, expect, test } from "@jest/globals";
import { CrossSection } from "../cable";
import { ShaftHeight } from "../emachine";
import { closest, splitRange } from "../utils";

describe("utils", () => {
  test("parse range type", () => {
    expect(splitRange("123-456")).toStrictEqual({ min: 123, max: 456 });
    expect(() => splitRange("123-a")).toThrow();
  });
  test("closest", () => {
    expect(closest([...ShaftHeight], 210)).toBe(200);
    expect(closest([...ShaftHeight], 396)).toBe(355);
    expect(closest([400, 1000], 400)).toBe(400);
  });
  test("closest up", () => {
    expect(closest([...CrossSection], 121.5, true)).toBe(150);
  });
});
