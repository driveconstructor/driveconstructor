import { EMachine, EMachineElement } from "./emachine";
import { Pump, PumpElement } from "./pump";
import { Model } from "./system";

export type PumpFc = {
  kind: "pump-fc";
  input: {
    pump: Pump;
    emachine: EMachine;
  };
};

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
  },
  findCandidates,
};

function findCandidates(system: PumpFc) {
  return JSON.stringify(system.input) + " " + new Date();
}
