import { Cable } from "./cable";
import { CableComponent } from "./cable-component";
import { findCableComponent as findCableCandidates } from "./cable-sizing";
import { BaseCandidates, BaseComponents } from "./component";
import { EMachineComponent } from "./emachine-component";
import { emachineCatalog, findTypeSpeedTorque } from "./emachine-sizing";
import { findFcConverters } from "./fconverter-sizing";
import { FConverterComponent as FConverterComponent } from "./fconverter-component";
import { System } from "./system";
import { findVoltageY } from "./voltage";

export type Mechanism = {
  ratedSpeed: number;
  ratedTorque: number;
  powerOnShaft: number;
  minimalSpeed: number;
  linear: boolean;
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

function findEmachines(system: System): EMachineComponent[] {
  let mechanism: Mechanism;
  const input = system.input;

  if (
    system.kind == "pump-fc" ||
    system.kind == "pump-fc-tr" ||
    system.kind == "pump-gb-fc" ||
    system.kind == "pump-gb-fc-tr"
  ) {
    mechanism = {
      ratedSpeed: input.pump.ratedSpeed,
      ratedTorque:
        input.pump.ratedTorque / input.emachine.overallTorqueDerating,
      powerOnShaft: input.pump.powerOnShaft,
      minimalSpeed: input.pump.minimalSpeed,
      linear:
        input.emachine.cooling == "IC411" &&
        input.pump.type == "positive displacement",
    };
  } else {
    throw new Error("Unsupported");
  }

  const typeSpeedAndTorqueList = findTypeSpeedTorque(
    input.emachine.type,
    mechanism,
  );
  const deratedVoltage = input.grid.voltage / input.emachine.voltageDerating;
  const voltageY = findVoltageY(deratedVoltage);

  const catalog = emachineCatalog(
    input.emachine,
    typeSpeedAndTorqueList,
    voltageY,
  );

  return distinctEmBySecondaryParams(catalog);
}

export function withCandidates(system: System): System {
  let candidates: BaseCandidates = { ...system.candidates };
  let components: BaseComponents = { ...system.components };

  const emachine = findEmachines(system);
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

  return {
    ...system,
    candidates,
    components,
  };
}

function distinctFcByMounting(fconverter: FConverterComponent[]) {
  const grouping = Object.groupBy(fconverter, (fc) => fc.mounting);
  return Object.entries(grouping)
    .flatMap(([_, v]) => v?.sort((a, b) => a.currentLO - b.currentLO)[0])
    .filter((v) => typeof v != "undefined");
}
