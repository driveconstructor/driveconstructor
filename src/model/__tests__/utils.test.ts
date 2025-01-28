import { describe, expect, test } from "@jest/globals";
import { closest, splitRange } from "../utils";
import { ShaftHeight } from "../emachine";

describe("utils", () => {
  test("parse range type", () => {
    expect(splitRange("123-456")).toStrictEqual({ min: 123, max: 456 });
    expect(() => splitRange("123-a")).toThrow();
  });
  test("closes", () => {
    expect(closest([...ShaftHeight], 210)).toBe(200);
  });
});
