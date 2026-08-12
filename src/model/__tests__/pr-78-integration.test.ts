import { describe, expect, test } from "@jest/globals";
import { findCableComponent } from "../cable-sizing";
import type { EMachineComponent } from "../emachine-component";
import { getPartialEfficiency } from "../emachine-efficiency";
import {
  calculateEMachinePrice,
  isWithinDfimSpeedRange,
} from "../emachine-sizing";
import { DFIMConverterType } from "../fconverter";
import {
  getConverterPowerFraction,
  isWithinFloorConverterOversizingLimit,
} from "../fconverter-sizing";
import { findGearbox } from "../gearbox-sizing";
import { withCandidates } from "../sizing";
import { createSystem, updateParam } from "../store";
import { customizeModel, getModel } from "../system";
import { calculateDfimWindPerformance } from "../wind";

describe("PR #78 integration", () => {
  test("reproduces the 2.1 MW DFIM wind calculation", () => {
    const wind = calculateDfimWindPerformance(75, 12);

    expect(wind.powerOnShaft).toBeCloseTo(2104.14, 2);
    expect(wind.ratedSpeedOfBlades).toBeCloseTo(21.39, 2);
    expect(wind.ratedTorque).toBeCloseTo(939.42, 2);
  });

  test("ties DFIM converter rating and speed range to 30% slip", () => {
    expect(getConverterPowerFraction("DFIM")).toBe(0.3);
    expect(getConverterPowerFraction("SCIM")).toBe(1);
    expect(isWithinDfimSpeedRange(700, 1000)).toBe(true);
    expect(isWithinDfimSpeedRange(1300, 1000)).toBe(true);
    expect(isWithinDfimSpeedRange(699, 1000)).toBe(false);
    expect(isWithinDfimSpeedRange(1301, 1000)).toBe(false);
  });

  test("preserves the existing PMSM partial-load efficiency curve", () => {
    const pmsm = {
      type: "PMSM",
      ratedPower: 1000,
      ratedSynchSpeed: 1500,
    } as Parameters<typeof getPartialEfficiency>[0];
    const expectedAtHalfLoad =
      (-0.32 * 0.5 ** 4 +
        0.98 * 0.5 ** 3 -
        1.14 * 0.5 ** 2 +
        0.58 * 0.5 +
        0.9 -
        0.1 * (1 - 0.5) ** 2) *
      95;

    expect(getPartialEfficiency(pmsm, 0.5, 95)).toBeCloseTo(expectedAtHalfLoad);
  });

  test("scopes the machine pricing rules to DFIM", () => {
    const machine = {
      type: "SCIM",
      ratedPower: 1000,
      ratedSynchSpeed: 1500,
    } as Parameters<typeof calculateEMachinePrice>[1];
    const voltage = {
      value: 660,
      min: 594,
      max: 726,
      type: "LV",
    } as const;
    const price = (
      type: "SCIM" | "DFIM",
      efficiencyClass: "IE2" | "IE3",
      cooling: "IC411" | "IC416",
    ) =>
      calculateEMachinePrice(
        voltage,
        { ...machine, type },
        10_000,
        "IP54/55",
        "cast iron",
        "B3",
        efficiencyClass,
        cooling,
      );

    expect(price("DFIM", "IE3", "IC411")).toBe(price("DFIM", "IE2", "IC411"));
    expect(price("SCIM", "IE3", "IC411")).toBeGreaterThan(
      price("SCIM", "IE2", "IC411"),
    );
    expect(price("DFIM", "IE2", "IC416")).toBeGreaterThan(
      price("DFIM", "IE2", "IC411"),
    );
    expect(price("SCIM", "IE2", "IC411")).toBeGreaterThan(
      price("SCIM", "IE2", "IC416"),
    );
  });

  test("extends the gearbox torque catalog only for DFIM", () => {
    const gearbox = {
      numberOfStages: 1,
      stage1Type: "helical",
      stage1Ratio: 3,
      stage2Type: "helical",
      stage2Ratio: 3,
      stage3Type: "helical",
      stage3Ratio: 3,
    } as const;

    expect(findGearbox(gearbox, 3_500_000)).toHaveLength(0);
    expect(findGearbox(gearbox, 3_500_000, true)[0].inputTorque).toBe(4000);
  });

  test("allows four-times floor converter oversizing only for DFIM", () => {
    expect(
      isWithinFloorConverterOversizingLimit("floor", 300, 100, "DFIM"),
    ).toBe(true);
    expect(
      isWithinFloorConverterOversizingLimit("floor", 300, 100, "SCIM"),
    ).toBe(false);
    expect(isWithinFloorConverterOversizingLimit("floor", 300, 100, null)).toBe(
      false,
    );
  });

  test("preserves the two-times floor limit and wall behavior", () => {
    expect(
      isWithinFloorConverterOversizingLimit("floor", 200, 100, "PMSM"),
    ).toBe(true);
    expect(
      isWithinFloorConverterOversizingLimit("floor", 201, 100, "PMSM"),
    ).toBe(false);
    expect(
      isWithinFloorConverterOversizingLimit("wall", 500, 100, "PMSM"),
    ).toBe(true);
  });

  test("separates DFIM cable quantity from electrical calculations", () => {
    const cable = {
      length: 100,
      material: "copper" as const,
      crossSection: 50 as const,
      numberOfRuns: 1 as const,
    };
    const machine = {
      type: "SCIM",
      ratedPower: 1000,
      workingCurrent: 100,
      ratedVoltageY: { max: 440 },
    } as EMachineComponent;

    const scim = findCableComponent(cable, machine)[0];
    const dfim = findCableComponent(cable, {
      ...machine,
      type: "DFIM",
    })[0];

    expect(dfim.length).toBe(133);
    expect(dfim.voltageDrop).toBeCloseTo(scim.voltageDrop);
    expect(dfim.losses).toBeCloseTo(scim.losses * 1.09);
    expect(dfim.price).toBeCloseTo(scim.price * 1.33);
  });

  test("restricts DFIM to supported wind topologies", () => {
    const directModel = getModel("wind-fc");
    const directSystem = createSystem(directModel);
    const directOptions = customizeModel(directModel, directSystem).input
      .emachine.params.type.options;

    const gearboxModel = getModel("wind-gb-fc");
    const gearboxSystem = createSystem(gearboxModel);
    const gearboxOptions = customizeModel(gearboxModel, gearboxSystem).input
      .emachine.params.type.options;

    expect(directOptions).not.toContain("DFIM");
    expect(gearboxOptions).toContain("DFIM");
  });

  test("selecting DFIM replaces an unsupported converter selection", () => {
    const model = getModel("wind-gb-fc");
    const system = createSystem(model);
    system.element = "emachine";

    const updated = updateParam(
      customizeModel(model, system),
      system,
      "type",
      "DFIM",
      (nextSystem) => customizeModel(getModel(nextSystem.kind), nextSystem),
    );
    const customized = customizeModel(model, updated);

    expect(updated.input.fconverter.type).toBe(DFIMConverterType[0]);
    expect(updated.input.fconverter.gridSideFilter).toBe("sin");
    expect(updated.input.emachine.protection).toBe("IP54/55");
    expect(updated.input.wind.rotorDiameter).toBe(75);
    expect(updated.input.wind.ratedWindSpeed).toBe(12);
    expect(updated.input.wind.ratedTorque).toBeCloseTo(939.42, 2);
    expect(updated.input.gearbox).toMatchObject({
      numberOfStages: 2,
      stage1Type: "helical",
      stage1Ratio: 8,
      stage2Type: "helical",
      stage2Ratio: 8,
    });
    expect(customized.input.fconverter.params.type.options).toEqual(
      DFIMConverterType,
    );
    expect(typeof customized.input.wind.params.rotorDiameter.value).toBe(
      "number",
    );
    expect(typeof customized.input.wind.params.ratedWindSpeed.value).toBe(
      "number",
    );
    expect(typeof customized.input.wind.params.ratedSpeedOfBlades.value).toBe(
      "function",
    );
    expect(typeof customized.input.wind.params.ratedTorque.value).toBe(
      "function",
    );
  });

  test("uses the DFIM wind inputs only after DFIM is selected", () => {
    const model = getModel("wind-gb-fc");
    let system = createSystem(model);

    const originalModel = customizeModel(model, system);
    expect(typeof originalModel.input.wind.params.ratedTorque.value).toBe(
      "number",
    );
    expect(typeof originalModel.input.wind.params.rotorDiameter.value).toBe(
      "function",
    );

    system.element = "emachine";
    system = updateParam(originalModel, system, "type", "DFIM", (nextSystem) =>
      customizeModel(getModel(nextSystem.kind), nextSystem),
    );

    expect(system.input.wind.rotorDiameter).toBe(75);
    expect(system.input.wind.ratedWindSpeed).toBe(12);
    expect(system.input.wind.powerOnShaft).toBeCloseTo(2104.14, 2);
    expect(system.input.wind.ratedTorque).toBeCloseTo(939.42, 2);

    const torqueAfterSelection = system.input.wind.ratedTorque;
    system.element = "gearbox";
    const dfimModelAfterSelection = customizeModel(model, system);
    system = updateParam(
      dfimModelAfterSelection,
      system,
      "stage1Ratio",
      8,
      (nextSystem) => customizeModel(getModel(nextSystem.kind), nextSystem),
    );
    expect(system.input.wind.ratedTorque).toBeCloseTo(torqueAfterSelection);

    system.element = "wind";
    let dfimModel = customizeModel(model, system);
    system = updateParam(dfimModel, system, "rotorDiameter", 75);
    dfimModel = customizeModel(model, system);
    system = updateParam(dfimModel, system, "ratedWindSpeed", 12);

    expect(system.input.wind.powerOnShaft).toBeCloseTo(2104.14, 2);
    expect(system.input.wind.ratedSpeedOfBlades).toBeCloseTo(21.39, 2);
    expect(system.input.wind.ratedTorque).toBeCloseTo(939.42, 2);
  });

  test.each(["wind-gb-fc", "wind-gb-fc-tr"] as const)(
    "DFIM defaults produce candidates for %s",
    (kind) => {
      const model = getModel(kind);
      const system = createSystem(model);
      system.element = "emachine";

      const updated = updateParam(
        customizeModel(model, system),
        system,
        "type",
        "DFIM",
        (nextSystem) => customizeModel(getModel(nextSystem.kind), nextSystem),
      );
      const emachineCandidates = updated.candidates.emachine ?? [];
      const withMachine = withCandidates({
        ...updated,
        components: {
          ...updated.components,
          emachine: emachineCandidates[0],
        },
      });

      expect(updated.candidates.gearbox).not.toHaveLength(0);
      expect(emachineCandidates).not.toHaveLength(0);
      expect(withMachine.candidates.cable).not.toHaveLength(0);
      expect(withMachine.candidates.fconverter).not.toHaveLength(0);
      if (kind == "wind-gb-fc-tr") {
        expect(withMachine.candidates.trafo).not.toHaveLength(0);
      }
    },
  );
});
