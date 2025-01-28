import { describe, expect, test } from "@jest/globals";
import { emachineCatalog, findTypeSpeedAndTorque } from "../emachine-sizing";
import { PumpFc, PumpFcModel } from "../pump-system";
import { initOrUpdateSystemInput } from "../store";
import { findVoltageY } from "../voltage";
//import { EMachineCooling, EMachineFrameMaterial } from "../emachine";

const pump = (initOrUpdateSystemInput(PumpFcModel) as PumpFc["input"]).pump;

describe("emachine", () => {
  /*test("typeSpeedAndTorque", () => {
    const result = findTypeSpeedAndTorque(pump.ratedSpeed, pump.ratedTorque);
    //console.log(JSON.stringify(result, null, 2));
    expect(result).toHaveLength(9);
  });*/

  test("voltage", () => {
    const v1 = findVoltageY(400);
    expect(v1.min).toBeCloseTo(360);
    expect(v1.max).toBeCloseTo(440);

    /* const v2 = findVoltageY(400);
    expect(v2.min).toBeCloseTo(594);
    expect(v2.max).toBeCloseTo(726);*/
  });

  /* test("catalog", () => {
    const tstList = findTypeSpeedAndTorque(pump.ratedSpeed, pump.ratedTorque);

    const voltage = findVoltageY(0, 400);
    const catalog = emachineCatalog(tstList, voltage);
    expect(catalog).toHaveLength(1458);
  });*/
});
