import icon from "../images/el-winch.svg";
import { SystemElement } from "./system";

export type Winch = {
  torque: number;
  ratedSpeed: number;
  emptyDrumDiameter: number;
  fullDrumDiameter: number;
  forceOnLine: number;
  speedOfLine: number;
  duty: number;
  dutyCyclePeriod: number;
  overloadDuration: number;
  overloadAmplitude: number;
  overloadCyclePeriod: number;
};

export const WinchElement: SystemElement<Winch> = {
  icon,
  params: {
    torque: {
      label: "Torque, kNm",
      type: "number",
      value: 100,
    },
    ratedSpeed: {
      label: "Rated speed, rpm",
      type: "number",
      value: 200,
    },
    emptyDrumDiameter: {
      type: "number",
      range: {
        min: 0.1,
        max: 1.8,
      },
      value: 0.3,
      label: "Drum diameter (empty), m",
    },
    fullDrumDiameter: {
      type: "number",
      range: {
        min: 0.11,
        max: 2,
      },
      value: 0.5,
      label: "Drum diameter (full), m",
    },
    forceOnLine: {
      type: "number",
      range: {
        min: 0.1,
        max: 100,
      },
      value: 10,
      label: "Force on the line (rated), kN",
    },
    speedOfLine: {
      type: "number",
      range: {
        min: 0.5,
        max: 20,
      },
      value: 3,
      label: "Speed of the line (rated), m/s",
    },
    duty: {
      type: "number",
      value: 100,
      range: {
        min: 50,
        max: 100,
      },
      label: "Duty, %",
      options: [50, 60, 70, 80, 90, 100],
      advanced: true,
    },
    dutyCyclePeriod: {
      type: "number",
      range: {
        min: 0.1,
        max: 100,
      },
      value: 1,
      label: "Duty cycle period, min",
      advanced: true,
    },
    overloadDuration: {
      type: "number",
      range: {
        min: 1,
        max: 120,
      },
      value: 10,
      label: "Overload duration, sec",
      advanced: true,
    },
    overloadAmplitude: {
      type: "number",
      range: {
        min: 0,
        max: 100,
      },
      value: 20,
      label: "Overload amplitude, %",
      advanced: true,
    },
    overloadCyclePeriod: {
      type: "number",
      range: {
        min: 30,
        max: 1200,
      },
      value: 60,
      label: "Overload cycle period, sec",
      advanced: true,
    },
  },
};
