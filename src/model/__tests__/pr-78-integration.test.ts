import { describe, expect, test } from "@jest/globals";
import { findCableComponent } from "../cable-sizing";
import type { EMachineComponent } from "../emachine-component";
import { DFIMConverterType } from "../fconverter";
import { createSystem, updateParam } from "../store";
import { customizeModel, getModel } from "../system";
import { migrateLegacyWindInput } from "../wind";

describe("PR #78 integration", () => {
  test("uses the DFIM effective cable length consistently", () => {
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
    expect(dfim.voltageDrop).toBeCloseTo(scim.voltageDrop * 1.33);
    expect(dfim.losses).toBeCloseTo(scim.losses * 1.33);
    expect(dfim.price).toBeCloseTo(scim.price * 1.33);
  });

  test("migrates legacy wind inputs without changing speed or power", () => {
    const legacy = {
      ratedSpeedOfBlades: 20,
      ratedTorque: 200,
      powerOnShaft: (20 / 9.55) * 200,
      overSpeed: 1.2,
    };

    const migrated = migrateLegacyWindInput(legacy);
    const diameter = migrated.rotorDiameter as number;
    const windSpeed = migrated.ratedWindSpeed as number;
    const migratedSpeed = (windSpeed * 7 * 60) / (Math.PI * diameter);
    const migratedPower =
      (((0.45 * 1.225) / 2) * windSpeed ** 3 * Math.PI * (diameter / 2) ** 2) /
      1000;

    expect(migratedSpeed).toBeCloseTo(legacy.ratedSpeedOfBlades);
    expect(migratedPower).toBeCloseTo(legacy.powerOnShaft);
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
    );
    const customized = customizeModel(model, updated);

    expect(updated.input.fconverter.type).toBe(DFIMConverterType[0]);
    expect(customized.input.fconverter.params.type.options).toEqual(
      DFIMConverterType,
    );
  });
});
