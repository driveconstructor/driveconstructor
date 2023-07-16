import { calculatePump } from "./pump";
import { PumpFc, PumpGbFc } from "./pump-system";
import { System } from "./system";
import { WinchFc } from "./winch-system";

export type GraphPoint = { speed: number; torque: number };

export function loadGraph(system: System): GraphPoint[] {
  switch (system.kind) {
    case "pump-fc":
    case "pump-gb-fc":
      return pumpLoadGraph(system);
    case "winch-fc":
      return winchLoadGraph(system);
  }

  //throw new Error("Usupported system kind: " + system.kind);
}

function pumpLoadGraph(system: PumpFc | PumpGbFc) {
  const pump = system.input.pump;
  const calcuated = calculatePump(pump);

  const numberOfPoints = Math.round(
    (1 - pump.minimalSpeed / pump.ratedSpeed) * 15,
  );
  const maximumSpeed = pump.ratedSpeed;

  const result: GraphPoint[] = [];
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

function winchLoadGraph(system: WinchFc) {
  const result: GraphPoint[] = []; //[[], []];

  const numberOfPoints = 10;
  const winch = system.input.winch;

  /* for (let i = 0; i <= numberOfPoints; i++) {
    const speed =
      winch.minimalSpeed +
      ((winch.ratedSpeed - winch.minimalSpeed) * i) / numberOfPoints;

    const torque = (winch.forceOnLine * winch.speedOfLine * 9.55) / speed;
    const torqueOverload = torque * (1 + winch.overloadAmplitude / 100);

    result[0].push({ speed, torque: torque * (winch.dutyCorrection || 1) });
    result[1].push({
      speed,
      torque: torqueOverload * (winch.dutyCorrection || 1),
    });
  }*/

  return result;
}