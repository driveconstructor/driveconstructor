import { CableElement } from "./cable";
import { BaseCandidates, BaseComponents } from "./component";
import { EMachineElement } from "./emachine";
import { NoTrafoFConvertorElement } from "./fconvertor";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Winch, WinchElement } from "./winch";

export type WinchFc = BaseSystem & {
  kind: "winch-fc";
  input: {
    winch: Winch;
  };
  candidates: BaseCandidates;
  components: BaseComponents;
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
    emachine: EMachineElement,
    cable: CableElement,
    fconvertor: NoTrafoFConvertorElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};
