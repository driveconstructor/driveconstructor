import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement, TrafoFConverterElement } from "./fconverter";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Trafo, TrafoElement } from "./trafo";
import { updateTrSystem } from "./trafo-system-utils";
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
      This simple system topology can be used when it is possible to find a
      motor matching speed of the winch drum and when both, the motor and the
      FC, have similar voltage rating to that of the grid.
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
      This simple system topology can be used when it is possible to find a
      motor matching speed of the winch drum and when both, the motor and the
      FC, have similar voltage rating to that of the grid.
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

export type WinchFcTr = BaseSystem & {
  kind: "winch-fc-tr";
  input: { winch: Winch; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WinchFcTrModel: Model<WinchFcTr> = {
  kind: "winch-fc-tr",
  title: "Drive train with voltage step down",
  description: (
    <div>
      In this solution the transformer is used for matching the voltage in the
      grid and FC&apos;s rated voltage and for galvanic insulation. It is
      possible to find a motor matching speed of the winch drum without any
      gearbox.
    </div>
  ),
  input: {
    winch: WinchElement,
    emachine: { ...WinchFcModel.input.emachine },
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

export type WinchGbFcTr = BaseSystem & {
  kind: "winch-gb-fc-tr";
  input: { winch: Winch; gearbox: Gearbox; trafo: Trafo };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WinchGbFcTrModel: Model<WinchGbFcTr> = {
  kind: "winch-gb-fc-tr",
  title: "Drive train with gearbox, electric machine, FC and transformer",
  description: (
    <div>
      This solution can be used when the winch drum has too low rated speed to
      be matched by an electric motor, and the braking resistor is used for
      burning energy generated when lowering the weight.
    </div>
  ),
  input: {
    winch: { ...WinchGbFcModel.input.winch },
    gearbox: GearboxElement,
    emachine: { ...WinchFcModel.input.emachine },
    cable: CableElement,
    fconverter: TrafoFConverterElement,
    trafo: TrafoElement,
    switch: SwitchElement,
    grid: {
      ...WinchFcTrModel.input.grid,
    },
  },
  update: updateTrSystem,
};
