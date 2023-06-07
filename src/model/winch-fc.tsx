import { Components } from "./component";
import { EMachine, EMachineElement } from "./emachine";
import { EMachineComponent } from "./emachine-component";
import { BaseSystem, Model } from "./system";
import { Winch, WinchElement } from "./winch";

export type WinchFc = BaseSystem & {
  kind: "winch-fc";
  input: {
    winch: Winch;
    emachine: EMachine;
  };
  candidates: {
    emachine: EMachineComponent[];
  };
  components: {
    emachine: EMachineComponent | null;
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
  loadGraph,
};

function findCandidates(system: WinchFc): Components {
  return { emachine: [], cable: [] };
}

function loadGraph(system: WinchFc) {
  return [];
}
