import { calculatePump } from "./pump";
import { System } from "./system";

export function loadGraph(system: System) {
  if (system.kind != "pump-fc") {
    throw new Error();
  }

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
