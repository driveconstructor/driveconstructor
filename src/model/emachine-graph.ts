import { EMachineComponent } from "./emachine-component";
import { GraphPoint } from "./graph-data";

export type EMachinGraphPoint = GraphPoint & {
  torqueOverload: number;
};

const numberOfPoints = 20;

function getSpeedPoints(emachine: EMachineComponent) {
  const result = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed = (emachine.maximumSpeed * i) / numberOfPoints;
    result.push(speed);
  }

  result.push(emachine.ratedSpeed, emachine.ratedSpeed / 2);

  return result.filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
}

export function emachineGraphData(
  gearRatio: number,
  emachine: EMachineComponent,
) {
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
