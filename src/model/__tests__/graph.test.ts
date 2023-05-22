import { describe, expect, test } from "@jest/globals";
import { Pump } from "../pump";
import { ForTesting, PumpFc } from "../pump-fc";

const pump: Pump = {
  type: "centrifugal",
  head: 200,
  flow: 50,
  fluidDensity: 1000,
  ratedEfficiency: 81,
  ratedSpeed: 1450,
  minimalSpeed: 0,
  startingTorque: 0,
};

describe("graph", () => {
  test("pump-fc load graph", () => {
    expect(ForTesting.loadGraph({ input: { pump } } as PumpFc)).toHaveLength(
      16
    );
  });
});
