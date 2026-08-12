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

export function calculateDfimWindPerformance(
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

function deriveWindDimensions(
  ratedSpeedOfBlades: number,
  powerOnShaft: number,
) {
  const speedFactor = (ratedSpeedOfBlades * Math.PI) / (TSR * 60);
  const rotorDiameter = Math.pow(
    (powerOnShaft * 1000 * 8) / (airDensity * Cp * Math.PI * speedFactor ** 3),
    1 / 5,
  );

  return {
    rotorDiameter,
    ratedWindSpeed: speedFactor * rotorDiameter,
  };
}

export const WindElement: SystemElement<Wind> = {
  icon,
  params: {
    ratedSpeedOfBlades: {
      label: "Rated speed of the blades, rpm",
      type: "number",
      value: 100,
      range: {
        min: 30,
        max: 400,
      },
    },
    ratedTorque: {
      label: "Rated torque, kNm",
      type: "number",
      value: 1,
      range: {
        min: 0.1,
        max: 100,
      },
    },
    overSpeed: {
      label: "Overspeed",
      type: "number",
      value: 1.2,
      precision: 1,
      range: {
        min: 1,
        max: 1.4,
        step: 0.05,
      },
    },
    ratedSpeed: {
      label: "Overspeed, rpm",
      type: "number",
      value: (wind) => wind.ratedSpeedOfBlades * wind.overSpeed,
    },
    powerOnShaft: {
      ...PowerOnShaftParam,
      value: (wind) => (wind.ratedSpeed / 9.55) * wind.ratedTorque,
    },
    rotorDiameter: {
      label: "Equivalent rotor diameter, m",
      type: "number",
      value: (wind) =>
        deriveWindDimensions(wind.ratedSpeedOfBlades, wind.powerOnShaft)
          .rotorDiameter,
      advanced: true,
    },
    ratedWindSpeed: {
      label: "Equivalent rated wind speed, m/s",
      type: "number",
      value: (wind) =>
        deriveWindDimensions(wind.ratedSpeedOfBlades, wind.powerOnShaft)
          .ratedWindSpeed,
      advanced: true,
    },
  },
};

/**
 * The DFIM model starts with turbine dimensions and derives the mechanical
 * operating point used for gearbox and machine sizing. Existing machine types
 * retain DriveConstructor's original speed-and-torque input direction.
 */
export const DfimWindElement: SystemElement<Wind> = {
  ...WindElement,
  params: {
    rotorDiameter: {
      label: "Rotor diameter, m",
      type: "number",
      value: 75,
      range: { min: 20, max: 200 },
    },
    ratedWindSpeed: {
      label: "Rated wind speed, m/s",
      type: "number",
      value: 12,
      range: { min: 5, max: 25 },
    },
    overSpeed: WindElement.params.overSpeed,
    powerOnShaft: {
      ...WindElement.params.powerOnShaft,
      value: (wind) =>
        calculateDfimWindPerformance(wind.rotorDiameter, wind.ratedWindSpeed)
          .powerOnShaft,
    },
    ratedSpeedOfBlades: {
      ...WindElement.params.ratedSpeedOfBlades,
      value: (wind) =>
        calculateDfimWindPerformance(wind.rotorDiameter, wind.ratedWindSpeed)
          .ratedSpeedOfBlades,
    },
    ratedTorque: {
      ...WindElement.params.ratedTorque,
      value: (wind) =>
        calculateDfimWindPerformance(wind.rotorDiameter, wind.ratedWindSpeed)
          .ratedTorque,
    },
    ratedSpeed: {
      ...WindElement.params.ratedSpeed,
      value: (wind) => wind.ratedSpeedOfBlades * wind.overSpeed,
    },
  },
};
