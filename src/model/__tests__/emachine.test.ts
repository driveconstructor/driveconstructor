import { describe, expect, test } from "@jest/globals";
import { combine, findTypeSpeedAndTorque, findVoltageY } from "../emachine-sizing";
import { Pump, calculatePump } from "../pump";
import { EMachineCooling, EMachineFrameMaterial } from "../emachine";

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

const mechanism = calculatePump(pump);

describe("emachine", () => {
  test("typeSpeedAndTorque", () => {
    const result = findTypeSpeedAndTorque(
      pump.ratedSpeed,
      mechanism.ratedTorque,
    );
    console.log(JSON.stringify(result, null, 2));
    expect(result).toHaveLength(9);
  });

  test("voltage", () => {
    const v1 = findVoltageY(0, 400);
    expect(v1.min).toBeCloseTo(360);
    expect(v1.max).toBeCloseTo(440);

    const v2 = findVoltageY(4000, 400);
    expect(v2.min).toBeCloseTo(594);
    expect(v2.max).toBeCloseTo(726);
  });

  test("combinations", () => {
    const tstList = findTypeSpeedAndTorque(
      pump.ratedSpeed,
      mechanism.ratedTorque,
    );

    const voltage = findVoltageY(0, 400);

    console.log(combine(tstList, voltage))
  });
});
