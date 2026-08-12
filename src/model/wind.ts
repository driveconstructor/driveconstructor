import icon from "../images/el-wind.svg";
import { PowerOnShaftParam } from "./mechanism-params";
import { SystemElement } from "./system";

export type Wind = {
  ratedSpeedOfBlades: number;
  ratedTorque: number;
  overSpeed: number;
  // calculated
  ratedSpeed: number;
  powerOnShaft: number;
  rotorDiameter: number;
  ratedWindSpeed: number;
};

const Cp = 0.45;
const TSR = 7;
const airDensity = 1.225;

// These turbine inputs reproduce the original direct-drive mechanical point:
// 100 rpm blade speed, 120 rpm overspeed and 1 kNm torque.
export const directDriveWindDefaults = {
  rotorDiameter: 10.3,
  ratedWindSpeed: 7.7,
  overSpeed: 1.2,
};

// These inputs reproduce the original geared mechanical point:
// 20 rpm blade speed, 24 rpm overspeed and 200 kNm torque.
export const gearedWindDefaults = {
  rotorDiameter: 56.5,
  ratedWindSpeed: 8.5,
  overSpeed: 1.2,
};

export function calculateWindPerformance(
  rotorDiameter: number,
  ratedWindSpeed: number,
) {
  const powerOnShaft =
    (((Cp * airDensity) / 2) *
      ratedWindSpeed ** 3 *
      Math.PI *
      (rotorDiameter / 2) ** 2) /
    1000;
  const ratedSpeedOfBlades =
    (ratedWindSpeed * TSR * 60) / (Math.PI * rotorDiameter);

  return {
    powerOnShaft,
    ratedSpeedOfBlades,
    ratedTorque: (powerOnShaft / ratedSpeedOfBlades) * 9.55,
  };
}

export const WindElement: SystemElement<Wind> = {
  icon,
  params: {
    rotorDiameter: {
      label: "Rotor diameter, m",
      type: "number",
      value: directDriveWindDefaults.rotorDiameter,
      range: { min: 5, max: 200 },
    },
    ratedWindSpeed: {
      label: "Rated wind speed, m/s",
      type: "number",
      value: directDriveWindDefaults.ratedWindSpeed,
      range: { min: 5, max: 25 },
    },
    overSpeed: {
      label: "Overspeed",
      type: "number",
      value: directDriveWindDefaults.overSpeed,
      precision: 1,
      range: {
        min: 1,
        max: 1.4,
        step: 0.05,
      },
    },
    powerOnShaft: {
      ...PowerOnShaftParam,
      value: (wind) =>
        calculateWindPerformance(wind.rotorDiameter, wind.ratedWindSpeed)
          .powerOnShaft,
    },
    ratedSpeedOfBlades: {
      label: "Rated speed of the blades, rpm",
      type: "number",
      value: (wind) =>
        calculateWindPerformance(wind.rotorDiameter, wind.ratedWindSpeed)
          .ratedSpeedOfBlades,
    },
    ratedSpeed: {
      label: "Overspeed, rpm",
      type: "number",
      value: (wind) => wind.ratedSpeedOfBlades * wind.overSpeed,
    },
    ratedTorque: {
      label: "Rated torque, kNm",
      type: "number",
      value: (wind) =>
        calculateWindPerformance(wind.rotorDiameter, wind.ratedWindSpeed)
          .ratedTorque,
    },
  },
};
