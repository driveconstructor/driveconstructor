import { PumpFc, PumpFcTr, PumpGbFc, PumpGbFcTr } from "./pump-system";
import { System } from "./system";
import { WinchFc } from "./winch-system";
import { WindFc, WindFcTr, WindGbFc, WindGbFcTr } from "./wind-system";

export type GraphPoint = { speed: number; torque: number };

export function systemGraphData(system: System): GraphPoint[] {
  switch (system.kind) {
    case "pump-fc":
    case "pump-gb-fc":
    case "pump-fc-tr":
    case "pump-gb-fc-tr":
      return pumpGraphData(system);
    case "winch-fc":
      return winchGraphData(system);
    case "wind-fc":
    case "wind-gb-fc":
    case "wind-fc-tr":
    case "wind-gb-fc-tr":
      return windGraphData(system);
  }
}

function pumpGraphData(system: PumpFc | PumpGbFc | PumpFcTr | PumpGbFcTr) {
  const pump = system.input.pump;

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
        result.push({ speed, torque: pump.ratedTorque });
      }
    } else {
      // n^2 /  ratedSpeed^2 x ratedTorque
      const torque =
        (Math.pow(speed, 2) * pump.ratedTorque) / Math.pow(pump.ratedSpeed, 2);
      result.push({ speed, torque });
    }
  }

  return result;
}

function winchGraphData(system: WinchFc) {
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

function windGraphData(system: WindFc | WindGbFc | WindFcTr | WindGbFcTr) {
  const wind = system.input.wind;
  const maxSpeed = wind.ratedSpeed;
  const ratedSpeed = wind.ratedSpeedOfBlades;
  const numberOfPoints = 15;
  const ratedTorque = wind.ratedTorque * 1000;

  const result: GraphPoint[] = []; //[[], []];

  let pointAdded = false;
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed = (maxSpeed * i) / numberOfPoints;
    if (speed >= ratedSpeed) {
      if (!pointAdded) {
        result.push({ speed: ratedSpeed, torque: ratedTorque });
        pointAdded = true;
      }
      result.push({ speed, torque: ratedTorque });
    } else {
      result.push({ speed, torque: (speed * ratedTorque) / ratedSpeed });
    }
  }
  return result;
}
