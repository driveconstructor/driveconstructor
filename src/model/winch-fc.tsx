import { EMachine, EMachineElement } from "./emachine";
import { Model } from "./system";
import { Winch, WinchElement } from "./winch";

export type WinchFc = {
  kind: "winch-fc";
  input: {
    winch: Winch;
    emachine: EMachine;
  };
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
  },
  findCandidates,
};

function findCandidates(system: WinchFc) {
  return "w-" + (system.input.winch.ratedSpeed + system.input.winch.torque);
}
