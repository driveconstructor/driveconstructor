import { describe, expect, test } from "@jest/globals";
import { closest, splitRange } from "../utils";
import { ShaftHeight } from "../emachine";
import { CrossSection } from "../cable";

describe("utils", () => {
  test("parse range type", () => {
    expect(splitRange("123-456")).toStrictEqual({ min: 123, max: 456 });
    expect(() => splitRange("123-a")).toThrow();
  });
  test("closest", () => {
    expect(closest([...ShaftHeight], 210)).toBe(200);
  });
  test("closest up", () => {
    expect(closest([...CrossSection], 121.5, true)).toBe(150);
  });
});
