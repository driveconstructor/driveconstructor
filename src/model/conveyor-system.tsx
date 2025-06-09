import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { Conveyor, ConveyorElement } from "./conveyor";
import { EMachineElement, EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";

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
      <p>
        This simple system topology can be used when it is possible to find a
        motor matching speed of the conveyor drum and when both, the motor and
        the FC, have similar voltage rating to that of the supply network (the
        grid).
      </p>
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
      <p>
        This solution can be used when for example the conveyor drum has too low
        rated speed to be matched by an available electric motor and the motor
        and the FC, have similar voltage rating to that of the supply network.
      </p>
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
