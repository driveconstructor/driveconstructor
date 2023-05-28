import { filterBySpeed } from "../emachine-sizing";
import { Pump, calculatePump } from "../pump";

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

describe("emachine", () => {
  test("sizing", () => {
    const v = calculatePump(pump);

    expect(filterBySpeed(pump.ratedSpeed, v.ratedTorque)).toHaveLength(9);
  });
});
