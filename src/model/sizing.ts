import { CableComponent, CableComponentModel } from "./cable-component";
import { findCableComponent } from "./cable-sizing";
import { CandidatesType, ComponentsType } from "./component";
import { EfficiencyClass, EMachine } from "./emachine";
import {
  EMachineComponent,
  EMachineComponentModel,
} from "./emachine-component";
import { findEmCandidates, findTypeSpeedTorque } from "./emachine-sizing";
import {
  FConverterComponent,
  FConverterComponentModel,
} from "./fconverter-component";
import { findFcConverters } from "./fconverter-sizing";
import { GearboxComponentModel } from "./gearbox-component";
import { findGearbox } from "./gearbox-sizing";
import { Grid } from "./grid";
import { System } from "./system";
import { SystemParamsType } from "./system-params";
import { TrafoComponent, TrafoComponentModel } from "./trafo-component";
import { findTrafoCandidates } from "./trafo-sizing";
import { haveSameContent } from "./utils";
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

function efficiencyClass(em: EMachineComponent): number {
  return em.efficiencyClass == null
    ? EfficiencyClass.length
    : EfficiencyClass.indexOf(em.efficiencyClass);
}

function distinctEmBySecondaryParams(emachines: EMachineComponent[]) {
  const grouping = Object.groupBy(emachines, (em) =>
    [
      em.ratedSynchSpeed,
      em.cooling,
      em.protection,
      em.frameMaterial,
      em.mounting,
      em.type,
    ].join("-"),
  );
  return Object.entries(grouping)
    .flatMap(
      ([_, v]) =>
        v?.sort(
          (a, b) =>
            efficiencyClass(a) - efficiencyClass(b) ||
            a.ratedSynchSpeed - b.ratedSynchSpeed ||
            a.ratedPower - b.ratedPower,
        )[0],
    )
    .filter((v) => typeof v != "undefined")
    .sort((a, b) => a.ratedSynchSpeed - b.ratedSynchSpeed);
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
  trafoRatio: number,
): EMachineComponent[] {
  const typeSpeedAndTorqueList = findTypeSpeedTorque(emachine.type, mechanism);
  const deratedVoltage = grid.voltage / emachine.voltageDerating / trafoRatio;
  const voltageY = findVoltageY(deratedVoltage);
  if (voltageY == null) {
    return [];
  }

  const catalog = findEmCandidates(
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
  let required: string[] = [];

  let mechanism = createMechanism(system);
  const trafoRatio =
    system.kind == "pump-fc-tr" || system.kind == "pump-gb-fc-tr"
      ? system.input.trafo.ratio
      : 1;

  if (system.kind == "pump-gb-fc" || system.kind == "pump-gb-fc-tr") {
    required.push(GearboxComponentModel.kind);
    const gearbox = findGearbox(system.input.gearbox, mechanism.ratedTorque);
    candidates = { ...candidates, gearbox };

    if (gearbox.length == 1) {
      const gearRatio = gearbox[0].gearRatio;
      const K = (gearRatio * gearbox[0].efficiency100) / 100;
      mechanism = {
        ...mechanism,
        ratedSpeed: mechanism.ratedSpeed * gearRatio,
        minimalSpeed: mechanism.minimalSpeed * gearRatio,
        ratedTorque: mechanism.ratedTorque / K,
        torqueOverload: mechanism.ratedTorque / K,
        gearRatio,
      };
      components = { ...components, gearbox: gearbox[0] };
    }
  }

  const emachine = findEMachineCandidates(
    system.input.emachine,
    system.input.grid,
    mechanism,
    trafoRatio,
  );
  if (emachine.length == 1) {
    components = { ...components, emachine: emachine[0] };
  }
  candidates = { ...candidates, emachine };

  let cable: CableComponent[] = [];
  if (components.emachine) {
    cable = findCableComponent(system.input.cable, components.emachine);
    if (cable.length == 1) {
      components = { ...components, cable: cable[0] };
    }
  }
  candidates = { ...candidates, cable };

  let fconverter: FConverterComponent[] = [];
  if (components.emachine && components.cable) {
    fconverter = findFcConverters(
      system.input.grid.voltage,
      components.cable.efficiency100,
      system.input.fconverter,
      components.emachine.workingCurrent,
      trafoRatio,
    );

    fconverter = distinctFcByMounting(fconverter);
    if (fconverter.length == 1) {
      components = { ...components, fconverter: fconverter[0] };
    }
  }
  candidates = { ...candidates, fconverter };

  if (system.kind == "pump-fc-tr" || system.kind == "pump-gb-fc-tr") {
    required.push(TrafoComponentModel.kind);
    let trafo: TrafoComponent[] = [];
    if (components.emachine) {
      trafo = findTrafoCandidates(
        system.input.trafo,
        components.emachine,
      ).slice(0, 1);
      components = { ...components, trafo: trafo[0] };
    }

    candidates = { ...candidates, trafo };
  }

  const params = haveSameContent(Object.keys(components), [
    ...required,
    EMachineComponentModel.kind,
    CableComponentModel.kind,
    FConverterComponentModel.kind,
  ])
    ? calculateParams(components, system.input.grid.shortCircuitPower)
    : null;

  return { ...system, candidates, components, params };
}

function distinctFcByMounting(fconverter: FConverterComponent[]) {
  const grouping = Object.groupBy(fconverter, (fc) => fc.mounting);
  return Object.entries(grouping)
    .flatMap(([_, v]) => v?.sort((a, b) => a.currentLO - b.currentLO)[0])
    .filter((v) => typeof v != "undefined");
}

function calculateParams(
  components: ComponentsType,
  shortCircuitPower: number,
): SystemParamsType {
  type ComponentType = Exclude<ComponentsType[keyof ComponentsType], undefined>;

  function apply(func: (v: ComponentType) => number) {
    return Object.entries(components).map(([_, v]) => func(v));
  }

  function sum(func: (v: ComponentType) => number) {
    return apply(func).reduce((a, b) => a + b, 0);
  }

  function multiply(func: (v: ComponentType) => number, base = 1) {
    return apply(func).reduce((a, b) => (a * b) / base, 1) * base;
  }

  return {
    price: sum((v) => v.price),
    efficiency100: multiply((v) => v.efficiency100, 100),
    efficiency75: multiply(
      (v) =>
        typeof v.efficiency75 == "undefined" ? v.efficiency100 : v.efficiency75,
      100,
    ),
    efficiency50: multiply(
      (v) =>
        typeof v.efficiency50 == "undefined" ? v.efficiency100 : v.efficiency50,
      100,
    ),
    efficiency25: multiply(
      (v) =>
        typeof v.efficiency25 == "undefined" ? v.efficiency100 : v.efficiency25,
      100,
    ),
    volume: sum((v) => (typeof v.volume == "undefined" ? 0 : v.volume)),
    footprint: sum((v) =>
      typeof v.footprint == "undefined" ? 0 : v.footprint,
    ),
    weight: sum((v) => (typeof v.weight == "undefined" ? 0 : v.weight)),
    thdU:
      components.fconverter && components.trafo
        ? thdU(components.fconverter, components.trafo, shortCircuitPower)
        : null,
    thdI:
      components.fconverter && components.trafo
        ? thdI(components.fconverter, components.trafo)
        : null,
  };
}

function thdU(
  fconverter: FConverterComponent,
  trafo: TrafoComponent,
  shortCircuitPower: number,
): number {
  let scr = (shortCircuitPower * 1000) / fconverter.ratedPower;
  if (scr < 20) {
    scr = 20;
  }

  if (fconverter.type == "2Q-2L-VSC-6p") {
    return (200 * 100) / scr;
  }

  if (fconverter.type == "2Q-2L-VSC-12p" && trafo.typeIII == "3-winding") {
    return (120 * 100) / scr;
  }

  if (fconverter.type == "4Q-2L-VSC" && trafo.typeIII == "2-winding") {
    return (115 * 100) / Math.pow(scr, 0.9);
  }

  throw new Error("Unexpected value");
}

function thdI(fconverter: FConverterComponent, trafo: TrafoComponent): number {
  if (fconverter.type === "2Q-2L-VSC-6p" && trafo.typeIII === "2-winding") {
    return 28;
  }

  if (fconverter.type === "2Q-2L-VSC-12p" && trafo.typeIII === "3-winding") {
    return 15;
  }

  if (fconverter.type === "4Q-2L-VSC" && trafo.typeIII === "2-winding") {
    return 4;
  }

  throw new Error("Unexpected value");
}
