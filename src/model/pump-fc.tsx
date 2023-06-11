import { CableElement } from "./cable";
import { Components } from "./component";
import { EMachineElement } from "./emachine";
import { EMachineComponent } from "./emachine-component";
import { NoTrafoFConvertorElement } from "./fconvertor";
import { GridElement } from "./grid";
import { Pump, PumpElement } from "./pump";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";

export type PumpFc = BaseSystem & {
  kind: "pump-fc";
  input: {
    pump: Pump;
  };
  candidates: Components;
  components: {
    emachine: EMachineComponent | null;
  };
};

export const PumpFcModel: Model<PumpFc> = {
  kind: "pump-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      element: This simple system topology can be used when it is possible to
      find a motor matching speed of the pump and when both, the motor and the
      FC, have similar voltage rating to that of the supply network (the grid).
    </div>
  ),
  input: {
    pump: PumpElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconvertor: NoTrafoFConvertorElement,
    switch: SwitchElement,
    grid: GridElement,
  },
  validate,
};

function validate(system: PumpFc): string[] {
  const result = [];
  const pump = system.input.pump;
  if (pump.minimalSpeed > pump.ratedSpeed) {
    result.push("The minimal speed may be not greater than the rated speed!");
  }

  return result;
}
