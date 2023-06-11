import { describe, expect, test } from "@jest/globals";
import { loadGraph } from "../load-graph";
import { Pump } from "../pump";
import { PumpFc } from "../pump-fc";

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
    expect(
      loadGraph({ kind: "pump-fc", input: { pump } } as PumpFc)
    ).toHaveLength(16);
  });
});
