import { CableElement } from "./cable";
import { BaseCandidates, BaseComponents } from "./component";
import { EMachineElement } from "./emachine";
import { NoTrafoFConvertorElement } from "./fconvertor";
import { Gearbox, GearboxElement } from "./gearbox";
import { GridElement } from "./grid";
import { Pump, PumpElement } from "./pump";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";

export type PumpFc = BaseSystem & {
  kind: "pump-fc";
  input: {
    pump: Pump;
  };
  candidates: BaseCandidates;
  components: BaseComponents;
};

function validate(system: PumpFc | PumpGbFc) {
  const result = [];
  const pump = system.input.pump;
  if (pump.minimalSpeed > pump.ratedSpeed) {
    result.push("The minimal speed may be not greater than the rated speed!");
  }

  return result;
}

export const PumpFcModel: Model<PumpFc> = {
  kind: "pump-fc",
  title: "Drive train with just variable speed drive",
  description: (
    <div>
      This simple system topology can be used when it is possible to find a
      motor matching speed of the pump and when both, the motor and the FC, have
      similar voltage rating to that of the supply network (the grid).
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

export type PumpGbFc = BaseSystem & {
  kind: "pump-gb-fc";
  input: {
    pump: Pump;
    gear: Gearbox;
  };
  candidates: BaseCandidates;
  components: BaseComponents;
};

export const PumpGbFcModel: Model<PumpGbFc> = {
  kind: "pump-gb-fc",
  title: "Drive train with speed gearing",
  description: (
    <div>
      This solution can be used when for example the pump has too low rated
      speed to be matched by an available electric motor and the motor and the
      FC, have similar voltage rating to that of the supply network.
    </div>
  ),
  input: {
    pump: {
      ...PumpElement,
      params: {
        ...PumpElement.params,
        ratedSpeed: { ...PumpElement.params.ratedSpeed, value: 100 },
      },
    },
    gear: GearboxElement,
    emachine: EMachineElement,
    cable: CableElement,
    fconvertor: NoTrafoFConvertorElement,
    switch: SwitchElement,
    grid: GridElement,
  },
  validate,
};
