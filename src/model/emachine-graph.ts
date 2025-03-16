import { EMachineComponent } from "./emachine-component";
import { TypeSpeedTorque } from "./emachine-sizing";
import { Gearbox } from "./gearbox";
import { GraphPoint } from "./load-graph";

export type EMachinGraphPoint = GraphPoint & {
  torqueOverload: number;
};

const numberOfPoints = 15;

function getSpeedPoints(emachine: EMachineComponent) {
  const result = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed = (emachine.maximumSpeed * i) / numberOfPoints;
    result.push(speed);
  }

  result.push(emachine.ratedSpeed, emachine.ratedSpeed / 2);

  return result.filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
}

export function getEMachineLoadGraphData(emachine: EMachineComponent) {
  const gearRatio = 1; // gearbox ? gearbox.gearRatio : 1;
  const speedPoints = getSpeedPoints(emachine).map((s) => s / gearRatio);

  return speedPoints.map((speed) => {
    const ratedTorque = emachine.ratedTorque * gearRatio;
    const ratedSpeed = emachine.ratedSpeed / gearRatio;

    const torqueWhenSpeedZero = ratedTorque * 0.5;
    const result = {
      torque: [],
      torqueOverload: [],
    };
    let torque;
    let torqueOverload;

    if (speed <= ratedSpeed / 2) {
      if (emachine.cooling !== "IC411") {
        torque = ratedTorque;
      } else {
        torque = (ratedTorque * speed) / ratedSpeed + torqueWhenSpeedZero;
      }
      torqueOverload = ratedTorque * emachine.torqueOverload;
    } else if (speed >= ratedSpeed) {
      torque = (ratedSpeed * ratedTorque) / speed;
      torqueOverload =
        (ratedSpeed * ratedTorque * emachine.torqueOverload) / speed;
    } else {
      torque = ratedTorque;
      torqueOverload = ratedTorque * emachine.torqueOverload;
    }

    return {
      speed,
      torque,
      torqueOverload,
    };
  });
}
