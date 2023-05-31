import { Cable, CableElement } from "./cable";
import { EMachine, EMachineElement } from "./emachine";
import { EMachineComponent } from "./emachine-component";
import { FConvertor, NoTrafoFConvertorElement } from "./fconvertor";
import { Grid, GridElement } from "./grid";
import { Pump, PumpElement, calculatePump } from "./pump";
import { SwitchElement } from "./switch";
import { BaseSystem, Model } from "./system";

type Components = {
  emachine: EMachineComponent[];
};

export type PumpFc = BaseSystem & {
  kind: "pump-fc";
  input: {
    pump: Pump;
    emachine: EMachine;
    cable: Cable;
    fconvertor: FConvertor;
    switch: {};
    grid: Grid;
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
  findCandidates,
  loadGraph,
  validate,
};

function findCandidates(system: PumpFc): Components {
  return {
    emachine: [
      {
        type: "SCIM",
        price: 25093,
        ratedPower: 132,
        ratedSpeed: 1488,
        ratedSynchSpeed: 1500,
        maximumSpeed: 1800,
        ratedVoltageY: { min: 360, max: 440, value: 400 },
        efficiencyClass: "IE4",
        efficiency100: 96.7,
        efficiency75: 96.67,
        efficiency50: 95.01,
        efficiency25: 90.03,
        ratedCurrent: 257.89,
        ratedTorque: 236.62,
        workingCurrent: 847.42,
        torqueOverload: 2.5,
        cosFi100: 0.764,
        cosFi75: 0.7258,
        cosFi50: 0.6876,
        cooling: "IC411",
        mounting: "B3",
        protection: "IP21/23",
        frameMaterial: "cast iron",
        shaftHeight: 280,
        outerDiameter: 0.56,
        length: 1.12,
        volume: 0.2759,
        momentOfInertia: 5.01,
        footPrint: 0.6272,
        weight: 961.34,
        designation: "IM-132-LV-400-SH280-ACS-IP2x-CI-1500-B3-IE4",
      },
    ],
  };
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

export const ForTesting = {
  loadGraph,
};
