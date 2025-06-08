import { PumpFc, PumpFcTr, PumpGbFc, PumpGbFcTr } from "./pump-system";
import { System } from "./system";
import { WinchFc, WinchFcTr, WinchGbFc, WinchGbFcTr } from "./winch-system";
import { WindFc, WindFcTr, WindGbFc, WindGbFcTr } from "./wind-system";

export type GraphPoint = {
  speed: number;
  torque: number;
  torqueOverload?: number;
};
export type GraphData = {
  label: string;
  overload: boolean;
  points: GraphPoint[];
};

export function systemGraphData(system: System): GraphData {
  switch (system.kind) {
    case "pump-fc":
    case "pump-gb-fc":
    case "pump-fc-tr":
    case "pump-gb-fc-tr":
      return pumpGraphData(system);
    case "winch-fc":
    case "winch-gb-fc":
    case "winch-fc-tr":
    case "winch-gb-fc-tr":
      return winchGraphData(system);
    case "wind-fc":
    case "wind-gb-fc":
    case "wind-fc-tr":
    case "wind-gb-fc-tr":
      return windGraphData(system);
    case "conveyor-fc":
      return { label: "conveyor", overload: true, points: [] };
  }
}

function pumpGraphData(system: PumpFc | PumpGbFc | PumpFcTr | PumpGbFcTr) {
  const pump = system.input.pump;

  const numberOfPoints = Math.round(
    (1 - pump.minimalSpeed / pump.ratedSpeed) * 15,
  );
  const maximumSpeed = pump.ratedSpeed;

  const points: GraphPoint[] = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed =
      ((maximumSpeed - pump.minimalSpeed) * i) / numberOfPoints +
      pump.minimalSpeed;
    if (pump.type == "positive displacement") {
      if (pump.minimalSpeed <= speed && speed <= maximumSpeed) {
        points.push({ speed, torque: pump.ratedTorque });
      }
    } else {
      // n^2 /  ratedSpeed^2 x ratedTorque
      const torque =
        (Math.pow(speed, 2) * pump.ratedTorque) / Math.pow(pump.ratedSpeed, 2);
      points.push({ speed, torque });
    }
  }

  return { label: "pump", overload: false, points };
}

function winchGraphData(system: WinchFc | WinchGbFc | WinchFcTr | WinchGbFcTr) {
  const points: GraphPoint[] = [];

  const numberOfPoints = 12;
  const winch = system.input.winch;

  for (let i = 0; i <= numberOfPoints; i++) {
    const speed =
      winch.minimalSpeed +
      ((winch.ratedSpeed - winch.minimalSpeed) * i) / numberOfPoints;

    const torque =
      ((winch.forceOnLine * winch.speedOfLine * 9.55) / speed) * 1000;
    const torqueOverload = torque * (1 + winch.overloadAmplitude / 100);
    const point = {
      speed,
      torque: torque * (winch.dutyCorrection || 1),
      torqueOverload: torqueOverload * (winch.dutyCorrection || 1),
    };

    points.push(point);
  }

  return { label: "winch", overload: true, points };
}

function windGraphData(system: WindFc | WindGbFc | WindFcTr | WindGbFcTr) {
  const wind = system.input.wind;
  const maxSpeed = wind.ratedSpeed;
  const ratedSpeed = wind.ratedSpeedOfBlades;
  const numberOfPoints = 15;
  const ratedTorque = wind.ratedTorque * 1000;

  const points: GraphPoint[] = []; //[[], []];

  let pointAdded = false;
  for (let i = 0; i <= numberOfPoints; i++) {
    const speed = (maxSpeed * i) / numberOfPoints;
    if (speed >= ratedSpeed) {
      if (!pointAdded) {
        points.push({ speed: ratedSpeed, torque: ratedTorque });
        pointAdded = true;
      }
      points.push({ speed, torque: ratedTorque });
    } else {
      points.push({ speed, torque: (speed * ratedTorque) / ratedSpeed });
    }
  }

  return { label: "wind", overload: false, points };
}
