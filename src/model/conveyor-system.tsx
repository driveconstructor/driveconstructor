import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { Conveyor, ConveyorElement } from "./conveyor";
import { EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
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
