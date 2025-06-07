import icon from "../images/el-winch.svg";
import { MinimalSpeedParam, PowerOnShaftParam } from "./mechanism-params";
import { SystemElement } from "./system";

export type Winch = {
  emptyDrumDiameter: number;
  fullDrumDiameter: number;
  forceOnLine: number;
  speedOfLine: number;
  duty: number;
  dutyCyclePeriod: number;
  overloadDuration: number;
  overloadAmplitude: number;
  overloadCyclePeriod: number;
  // calculated
  minimalSpeed: number;
  powerOnShaft: number;
  ratedTorque: number;
  ratedSpeed: number;
  lowTorque: number;
  dutyCorrection: number;
  torqueOverload: number;
};

export const WinchElement: SystemElement<Winch> = {
  icon,
  params: {
    emptyDrumDiameter: {
      type: "number",
      range: {
        min: 0.1,
        max: 1.8,
        step: 0.1,
      },
      precision: 1,
      value: 0.3,
      label: "Drum diameter (empty), m",
    },
    fullDrumDiameter: {
      type: "number",
      range: {
        min: 0.1,
        max: 2,
        step: 0.1,
      },
      value: 0.5,
      precision: 1,
      label: "Drum diameter (full), m",
    },
    forceOnLine: {
      type: "number",
      range: {
        min: 0.1,
        max: 100,
        step: 0.1,
      },
      precision: 1,
      value: 10,
      label: "Force on the line (rated), kN",
    },
    speedOfLine: {
      type: "number",
      range: {
        min: 0.5,
        max: 20,
        step: 0.5,
      },
      precision: 1,
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
      precision: 1,
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
    minimalSpeed: {
      ...MinimalSpeedParam,
      value: (winch) => {
        return (winch.speedOfLine * 9.55 * 2) / winch.fullDrumDiameter;
      },
    },
    ratedTorque: {
      label: "Torque, kNm",
      type: "number",
      precision: 2,
      value: (winch) => (winch.forceOnLine * winch.fullDrumDiameter) / 2,
    },
    ratedSpeed: {
      label: "Rated speed, rpm",
      type: "number",
      value: (winch) =>
        (winch.speedOfLine * 9.55 * 2) / winch.emptyDrumDiameter,
    },
    powerOnShaft: {
      ...PowerOnShaftParam,
      value: (winch) => (winch.ratedSpeed / 9.55) * winch.ratedTorque,
    },
    lowTorque: {
      label: "Low torque, kNm",
      type: "number",
      precision: 1,
      value: (winch) => (winch.forceOnLine * winch.emptyDrumDiameter) / 2,
    },
    torqueOverload: {
      label: "Torque overload, kNm",
      type: "number",
      precision: 1,
      value: (winch) => winch.ratedTorque * (1 + winch.overloadAmplitude / 100),
    },
    dutyCorrection: {
      label: "Duty correction",
      type: "number",
      precision: 2,
      value: (winch) => {
        const emWeight =
          3000 *
          Math.pow((winch.ratedTorque * winch.ratedSpeed) / 9.55 / 1000, 0.8) *
          Math.pow(400 / Math.pow(1000, 0.9) + 1, 1.43);

        const emThermalConstant =
          0.15 * Math.pow(Math.log10(emWeight + 1), 1.5);

        const K = ((winch.dutyCyclePeriod / 60) * winch.duty) / 100;

        if (emThermalConstant <= 0.5 * K) {
          return 1;
        }

        if (emThermalConstant >= 2 * K) {
          return winch.duty / 100;
        }

        return (
          (emThermalConstant / ((1.5 * winch.duty) / 100) - 1 / 3) *
            (1 - winch.duty / 100) +
          winch.duty / 100
        );
      },
    },
  },
};
