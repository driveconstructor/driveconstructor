import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachinePMSMElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
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
