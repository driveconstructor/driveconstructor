import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachineElement } from "./emachine";
import { NoTrafoFConverterElement, TrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { Pump, PumpElement } from "./pump";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Trafo, TrafoElement } from "./trafo";
import { splitRange, valueDifference } from "./utils";

export type PumpFc = BaseSystem & {
  kind: "pump-fc";
  input: { pump: Pump };
  candidates: CandidatesType;
  components: ComponentsType;
};

function validate(system: PumpFc | PumpGbFc) {
  const result = [];
  const pump = system.input.pump;
  if (pump.minimalSpeed > pump.ratedSpeed) {
    result.push("The minimal speed may be not greater than the rated speed!");
  }

  const emachine = system.input.emachine;
  const difference =
    emachine.ratedPower == null
      ? null
      : valueDifference(pump.powerOnShaft * 1.1, emachine.ratedPower as number);

  if (difference != null && difference > 0.2) {
    result.push(
      'Power of the pump and the motor do not match! \
      Either adjust power of the motor or set it to "any". Alternatively \
      check inputs for the pump.',
    );
  }

  return result;
}

export const PumpFcModel: Model<PumpFc> = {
  kind: "pump-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      This simple system topology can be used when it is possible to find a
      motor matching speed of the pump and when both, the motor and the FC, have
      similar voltage rating to that of the supply network (the grid).
    </div>
  ),
  input: {
    pump: PumpElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
  validate,
};

export type PumpGbFc = BaseSystem & {
  kind: "pump-gb-fc";
  input: { pump: Pump; gearbox: Gearbox };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const PumpGbFcModel: Model<PumpGbFc> = {
  kind: "pump-gb-fc",
  title: "Drive train with speed gearing",
  description: (
    <div>
      This solution can be used when for example the pump has too low rated
      speed to be matched by an available electric motor and the motor and the
      FC, have similar voltage rating to that of the supply network.
    </div>
  ),
  input: {
    pump: {
      ...PumpElement,
      params: {
        ...PumpElement.params,
        ratedSpeed: { ...PumpElement.params.ratedSpeed, value: 100 },
      },
    },
    gearbox: GearboxElement,
    /* TODO: use this for wind
   emachine: {
      ...EMachineElement,
      params: {
        ...EMachineElement.params,
        type: { ...EMachineElement.params.type, value: "PMSM" },
      },
    },*/
    emachine: EMachineElement,
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
  validate,
};

function updateTrSystem<T extends PumpFcTr | PumpGbFcTr>(system: T): T {
  const trafo = system.input.trafo;
  const grid = system.input.grid;

  const voltageLV = splitRange(trafo.sideVoltageLV);

  const minRatio = grid.voltage / voltageLV.min;
  const maxRatio = grid.voltage / voltageLV.max;

  const ratio = ((1 + Number(trafo.tappings)) * (maxRatio + minRatio)) / 2;

  return {
    ...system,
    input: {
      ...system.input,
      trafo: { ...trafo, sideVoltageHV: grid.voltage, ratio },
    },
  };
}

export type PumpFcTr = BaseSystem & {
  kind: "pump-fc-tr";
  input: { pump: Pump; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const PumpFcTrModel: Model<PumpFcTr> = {
  kind: "pump-fc-tr",
  title: "Drive train with voltage step down",
  description: (
    <div>
      In this solution the transformer is used for matching the voltage in the
      grid and FC&apos;s rated voltage and/or for galvanic insulation. It is
      possible to find a motor matching speed of the pump without any gearbox.
    </div>
  ),
  input: {
    pump: PumpElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconverter: TrafoFConverterElement,
    trafo: TrafoElement,
    switch: SwitchElement,
    grid: {
      ...GridElement,
      params: {
        ...GridElement.params,
        voltage: { ...GridElement.params.voltage, value: 6000 },
      },
    },
  },
  update: updateTrSystem,
};

export type PumpGbFcTr = BaseSystem & {
  kind: "pump-gb-fc-tr";
  input: { pump: Pump; gearbox: Gearbox; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const PumpGbFcTrModel: Model<PumpGbFcTr> = {
  kind: "pump-gb-fc-tr",
  title: "Drive train with voltage step-down and speed gearing",
  description: (
    <div>
      This solution can be used when the pump has too low rated speed to be
      matched by an electric motor, and the transformer is used for matching the
      voltage in the grid and FC&apos;s and/or for galvanic insulation.
    </div>
  ),
  input: {
    pump: { ...PumpGbFcModel.input.pump },
    gearbox: GearboxElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconverter: TrafoFConverterElement,
    trafo: TrafoElement,
    switch: SwitchElement,
    grid: {
      ...GridElement,
      params: {
        ...GridElement.params,
        voltage: { ...GridElement.params.voltage, value: 6000 },
      },
    },
  },
  update: updateTrSystem,
};
