import { CableComponent } from "./cable-component";
import { findCableComponent as findCableCandidates } from "./cable-sizing";
import { CandidatesType, ComponentsType } from "./component";
import { EMachine } from "./emachine";
import { EMachineComponent } from "./emachine-component";
import {
  findEmCandidates as findEmachines,
  findTypeSpeedTorque,
} from "./emachine-sizing";
import { FConverterComponent } from "./fconverter-component";
import { findFcConverters } from "./fconverter-sizing";
import { findGearbox } from "./gearbox-sizing";
import { Grid } from "./grid";
import { System } from "./system";
import { findVoltageY } from "./voltage";

export type Mechanism = {
  ratedSpeed: number;
  ratedTorque: number;
  powerOnShaft: number;
  minimalSpeed: number;
  linear: boolean;
  torqueOverload: number;
  gearRatio: number;
};

function distinctEmBySecondaryParams(emachines: EMachineComponent[]) {
  const grouping = Object.groupBy(emachines, (em) =>
    [
      em.cooling,
      em.protection,
      em.frameMaterial,
      em.mounting,
      em.type,
      em.efficiencyClass,
    ].join("-"),
  );
  return Object.entries(grouping)
    .flatMap(([_, v]) => v?.sort((a, b) => a.ratedPower - b.ratedPower)[0])
    .filter((v) => typeof v != "undefined");
}

function createMechanism(system: System): Mechanism {
  const input = system.input;

  if (
    system.kind == "pump-fc" ||
    system.kind == "pump-fc-tr" ||
    system.kind == "pump-gb-fc" ||
    system.kind == "pump-gb-fc-tr"
  ) {
    return {
      ratedSpeed: input.pump.ratedSpeed,
      ratedTorque:
        input.pump.ratedTorque / input.emachine.overallTorqueDerating,
      powerOnShaft: input.pump.powerOnShaft,
      minimalSpeed: input.pump.minimalSpeed,
      linear:
        input.emachine.cooling == "IC411" &&
        input.pump.type == "positive displacement",
      torqueOverload: input.pump.torqueOverload,
      gearRatio: 1,
    };
  } else {
    throw new Error("Unsupported ty");
  }
}

function findEMachineCandidates(
  emachine: EMachine,
  grid: Grid,
  mechanism: Mechanism,
): EMachineComponent[] {
  const typeSpeedAndTorqueList = findTypeSpeedTorque(emachine.type, mechanism);
  const deratedVoltage = grid.voltage / emachine.voltageDerating;
  const voltageY = findVoltageY(deratedVoltage);

  const catalog = findEmachines(
    emachine,
    typeSpeedAndTorqueList,
    voltageY,
    mechanism.torqueOverload,
  );

  return distinctEmBySecondaryParams(catalog);
}

export function withCandidates(system: System): System {
  let candidates: CandidatesType = { ...system.candidates };
  let components: ComponentsType = { ...system.components };

  let mechanism = createMechanism(system);

  if (system.kind == "pump-gb-fc" || system.kind == "pump-gb-fc-tr") {
    const gearbox = findGearbox(system.input.gearbox, mechanism.ratedTorque);
    if (gearbox.length == 1) {
      components = { ...components, gearbox: gearbox[0] };
      const gearRatio = gearbox[0].gearRatio;
      const K = (gearRatio * gearbox[0].efficiency100) / 100;
      mechanism = {
        ...mechanism,
        ratedSpeed: mechanism.ratedSpeed * gearRatio,
        ratedTorque: mechanism.ratedTorque / K,
        torqueOverload: mechanism.ratedTorque / K,
      };
    } else {
      return { ...system, candidates: { ...candidates, gearbox }, components };
    }
  }

  const emachine = findEMachineCandidates(
    system.input.emachine,
    system.input.grid,
    mechanism,
  );
  if (emachine.length == 1) {
    components = { ...components, emachine: emachine[0] };
  }
  candidates = { ...candidates, emachine };

  let cable: CableComponent[] = [];
  if (components.emachine) {
    cable = findCableCandidates(system.input.cable, components.emachine);
    if (cable.length == 1) {
      components = { ...components, cable: cable[0] };
    }
    candidates = { ...candidates, cable };
  }

  let fconverter: FConverterComponent[] = [];
  if (components.emachine && components.cable) {
    fconverter = findFcConverters(
      system.input.grid.voltage,
      components.cable.efficiency100,
      system.input.fconverter,
      components.emachine.workingCurrent,
    );

    fconverter = distinctFcByMounting(fconverter);
    if (fconverter.length == 1) {
      components = { ...components, fconverter: fconverter[0] };
    }
    candidates = { ...candidates, fconverter };
  }

  return { ...system, candidates, components };
}

function distinctFcByMounting(fconverter: FConverterComponent[]) {
  const grouping = Object.groupBy(fconverter, (fc) => fc.mounting);
  return Object.entries(grouping)
    .flatMap(([_, v]) => v?.sort((a, b) => a.currentLO - b.currentLO)[0])
    .filter((v) => typeof v != "undefined");
}
