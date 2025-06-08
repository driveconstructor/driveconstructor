import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Winch, WinchElement } from "./winch";

export type WinchFc = BaseSystem & {
  kind: "winch-fc";
  input: {
    winch: Winch;
  };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WinchFcModel: Model<WinchFc> = {
  kind: "winch-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      <p>
        This simple system topology can be used when it is possible to find a
        motor matching speed of the winch drum and when both, the motor and the
        FC, have similar voltage rating to that of the grid.
      </p>
    </div>
  ),
  input: {
    winch: WinchElement,
    emachine: {
      ...EMachinePMSMElement,
    },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};

export type WinchGbFc = BaseSystem & {
  kind: "winch-gb-fc";
  input: {
    winch: Winch;
    gearbox: Gearbox;
  };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WinchGbFcModel: Model<WinchGbFc> = {
  kind: "winch-gb-fc",
  title: "Drive train with speed gearing",
  description: (
    <div>
      <p>
        This simple system topology can be used when it is possible to find a
        motor matching speed of the winch drum and when both, the motor and the
        FC, have similar voltage rating to that of the grid.
      </p>
    </div>
  ),
  input: {
    winch: {
      ...WinchElement,
      params: {
        ...WinchElement.params,
        emptyDrumDiameter: {
          ...WinchElement.params.emptyDrumDiameter,
          value: 0.6,
        },
        fullDrumDiameter: {
          ...WinchElement.params.fullDrumDiameter,
          value: 1,
        },
        forceOnLine: {
          ...WinchElement.params.forceOnLine,
          value: 5,
        },
        speedOfLine: {
          ...WinchElement.params.speedOfLine,
          value: 2,
        },
      },
    },
    gearbox: GearboxElement,
    emachine: {
      ...EMachinePMSMElement,
    },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};
