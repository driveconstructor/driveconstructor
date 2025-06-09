import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { Conveyor, ConveyorElement } from "./conveyor";
import { EMachineElement, EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement, TrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Trafo, TrafoElement } from "./trafo";
import { updateTrSystem } from "./trafo-system-utils";

export type ConveyorFc = BaseSystem & {
  kind: "conveyor-fc";
  input: {
    conveyor: Conveyor;
  };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const ConveyorFcModel: Model<ConveyorFc> = {
  kind: "conveyor-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      This simple system topology can be used when it is possible to find a
      motor matching speed of the conveyor drum and when both, the motor and the
      FC, have similar voltage rating to that of the supply network (the grid).
    </div>
  ),
  input: {
    conveyor: ConveyorElement,
    emachine: {
      ...EMachinePMSMElement,
    },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};

export type ConveyorGbFc = BaseSystem & {
  kind: "conveyor-gb-fc";
  input: {
    conveyor: Conveyor;
    gearbox: Gearbox;
  };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const ConveyorGbFcModel: Model<ConveyorGbFc> = {
  kind: "conveyor-gb-fc",
  title: "Drive train with speed gearing",
  description: (
    <div>
      This solution can be used when for example the conveyor drum has too low
      rated speed to be matched by an available electric motor and the motor and
      the FC, have similar voltage rating to that of the supply network.
    </div>
  ),
  input: {
    conveyor: ConveyorElement,
    gearbox: GearboxElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};

export type ConveyorFcTr = BaseSystem & {
  kind: "conveyor-fc-tr";
  input: { conveyor: Conveyor; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const ConveyorFcTrModel: Model<ConveyorFcTr> = {
  kind: "conveyor-fc-tr",
  title: "Drive train with voltage step down",
  description: (
    <div>
      In this solution the transformer is used for matching the voltage in the
      grid and FC&apos;s rated voltage and/or for galvanic insulation. It is
      possible to find a motor matching speed of the conveyor drum without any
      gearbox.
    </div>
  ),
  input: {
    conveyor: ConveyorElement,
    emachine: { ...ConveyorFcModel.input.emachine },
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
