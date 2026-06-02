import icon from "../images/el-wind.svg";
import { PowerOnShaftParam } from "./mechanism-params";
import { SystemElement } from "./system";

export type Wind = {
  rotorDiameter: number;
  ratedSpeedOfBlades: number;
  ratedTorque: number;
  overSpeed: number;
  // calculated
  ratedSpeed: number;
  ratedWindSpeed: number;
  powerOnShaft: number;
};

const Cp = 0.45;
const TSR = 7;
const airDensity = 1.225;

export const WindElement: SystemElement<Wind> = {
  icon,
  params: {
    rotorDiameter: {
      label: "Rotor diameter, m",
      type: "number",
      value: 50,
      range: {
        min: 20,
        max: 200,
      },
    },
    ratedWindSpeed: {
      label: "Rated wind speed, m/s",
      type: "number",
      value: 12,
      range: {
        min: 5,
        max: 25,
      },
    },
    /*ratedSpeedOfBlades: {
      label: "Rated speed of the blades, rpm",
      type: "number",
      value: 20,
      range: {
        min: 10,
        max: 50,
      },
    },*/
    /*ratedTorque: {
      label: "Rated torque, kNm",
      type: "number",
      value: 1,
      range: {
        min: 0.1,
        max: 1000,
      },
    },*/
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

    /*rotorDiameter: {
      label: "Rotor diameter, m",
      type: "number",
      value: (wind) =>
        2 *
        Math.sqrt(
          wind.powerOnShaft /
            ((((0.5 * 1.225) / 2) * wind.ratedWindSpeed) ^ (3 * Math.PI)),
        ),
    },*/
    /*ratedWindSpeed: {
      label: "Rated wind speed, m/s",
      type: "number",
      value: (wind) =>
        (wind.ratedSpeedOfBlades * Math.PI * wind.rotorDiameter) / (TSR * 60),
    },*/
    powerOnShaft: {
      ...PowerOnShaftParam,
      value: (wind) =>
        (((Cp * airDensity) / 2) *
          wind.ratedWindSpeed ** 3 *
          Math.PI *
          (wind.rotorDiameter / 2) ** 2) /
        1000,
      //(wind) => (wind.ratedSpeed / 9.55) * wind.ratedTorque,
    },
    ratedSpeedOfBlades: {
      label: "Rated speed of the blades, rpm",
      type: "number",
      value: (wind) =>
        (wind.ratedWindSpeed * TSR * 60) / (Math.PI * wind.rotorDiameter),
    },
    ratedSpeed: {
      label: "Overspeed, rpm",
      type: "number",
      value: (wind) => wind.ratedSpeedOfBlades * wind.overSpeed,
    },
    ratedTorque: {
      label: "Rated torque, kNm",
      type: "number",
      value: (wind) => (wind.powerOnShaft / wind.ratedSpeedOfBlades) * 9.55,
    },
  },
};
