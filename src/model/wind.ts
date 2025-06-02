import icon from "../images/el-wind.svg";
import { SystemElement } from "./system";

export type Wind = {
  ratedSpeedOfBlades: number;
  ratedTorque: number;
  overSpeed: number;
  // calculated
  ratedSpeed: number;
};

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
  },
};
