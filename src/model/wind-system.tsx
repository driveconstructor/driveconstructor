import { CableElement } from "./cable";
import { CandidatesType, ComponentsType } from "./component";
import { EMachineElement } from "./emachine";
import { NoTrafoFConverterElement } from "./fconverter";
import { GridElement } from "./grid";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";
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
        This simple system topology can be used at low powers when it is
        possible to find a generator matching speed of the turbine blades and
        when both, the generator and the FC, have voltage rating close to that
        of the grid.
      </p>
    </div>
  ),
  input: {
    wind: WindElement,
    emachine: {
      ...EMachineElement,
      params: {
        ...EMachineElement.params,
        type: {
          ...EMachineElement.params.type,
          value: "PMSM",
        },
      },
    },
    cable: CableElement,
    fconverter: NoTrafoFConverterElement,
    switch: SwitchElement,
    grid: GridElement,
  },
};
