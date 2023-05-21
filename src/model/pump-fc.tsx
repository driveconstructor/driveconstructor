import { Cable, CableElement } from "./cable";
import { EMachine, EMachineElement } from "./emachine";
import { FConvertor, FConvertorElement } from "./fconvertor";
import { Pump, PumpElement, calculatePump } from "./pump";
import { Model } from "./system";

export type PumpFc = {
  kind: "pump-fc";
  input: {
    pump: Pump;
    emachine: EMachine;
    cable: Cable;
    fconvertor: FConvertor;
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
    cable: CableElement,
    fconvertor: FConvertorElement,
  },
  findCandidates,
  loadGraph,
  validate,
};

function findCandidates(system: PumpFc) {
  return JSON.stringify(system.input) + " " + new Date();
}

function loadGraph(system: PumpFc) {
  const pump = system.input.pump;
  const calcuated = calculatePump(pump);

  const numberOfPoints = Math.round(
    (1 - pump.minimalSpeed / pump.ratedSpeed) * 15
  );
  const maximumSpeed = pump.ratedSpeed;

  const result = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed =
      ((maximumSpeed - pump.minimalSpeed) * i) / numberOfPoints +
      pump.minimalSpeed;
    if (pump.type == "positive displacement") {
      if (pump.minimalSpeed <= speed && speed <= maximumSpeed) {
        result.push({ speed, torque: calcuated.ratedTorque });
      }
    } else {
      // n^2 /  ratedSpeed^2 x ratedTorque
      const torque =
        (Math.pow(speed, 2) * calcuated.ratedTorque) /
        Math.pow(pump.ratedSpeed, 2);
      result.push({ speed, torque });
    }
  }

  return result;
}

function validate(system: PumpFc): string[] {
  const result = [];
  const pump = system.input.pump;
  if (pump.minimalSpeed > pump.ratedSpeed) {
    result.push("The minimal speed may be not greater than the rated speed!");
  }

  return result;
}
