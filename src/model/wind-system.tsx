import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachineElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
import { Winch, WinchElement } from "./winch";
import { Wind, WindElement } from "./wind";

export type WindFc = BaseSystem & {
  kind: "wind-fc";
  input: {
    wind: Wind;
  };
  candidates: CandidatesType;
  components: ComponentsType;
};

export const WindFcModel: Model<WindFc> = {
  kind: "wind-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      <p>
TODO
      </p>
    </div>
  ),
  input: {
    wind: WindElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};
