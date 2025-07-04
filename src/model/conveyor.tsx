import icon from "../images/el-conveyor.svg";
import {
  DutyCorrectionParam,
  PowerOnShaftParam,
  RatedSpeedParam,
  TorqueOverloadParam,
} from "./mechanism-params";
import { System, SystemElement } from "./system";

export type Conveyor = {
  ratedTorque: number;
  maximumSpeed: number;
  minimalSpeed: number;
  duty: number;
  dutyCyclePeriod: number;
  overloadDuration: number;
  overloadAmplitude: number;
  overloadCyclePeriod: number;
  startingTorque: number;
  // calculated
  ratedSpeed: number;
  powerOnShaft: number;
  torqueOverload: number;
  dutyCorrection: number;
};

export const ConveyorElement: SystemElement<Conveyor> = {
  icon,
  params: {
    ratedTorque: {
      label: "Rated torque, kNm",
      type: "number",
      value: 10,
      range: {
        min: 0.1,
        max: 100,
      },
    },
    maximumSpeed: {
      label: "Max speed, rpm",
      type: "number",
      value: 100,
      range: {
        min: 10,
        max: 3000,
      },
      update(system, value) {
        return {
          ...system,
          input: {
            ...system.input,
            conveyor: { ...system.input.conveyor, minimalSpeed: value * 0.2 },
          },
        } as System;
      },
    },
    minimalSpeed: {
      label: "Min speed, rpm",
      type: "number",
      value: 50,
      range: {
        min: 1,
        max: 2000,
      },
    },
    duty: {
      type: "number",
      label: "Duty, %",
      value: 100,
      options: [50, 60, 70, 80, 90, 100],
      range: {
        min: 50,
        max: 100,
      },
    },
    dutyCyclePeriod: {
      label: "Duty cycle period, min",
      type: "number",
      value: 1,
      range: {
        min: 0.1,
        max: 100,
      },
    },
    overloadDuration: {
      label: "Overload duration, sec",
      type: "number",
      value: 10,
      range: {
        min: 1,
        max: 120,
      },
    },
    overloadAmplitude: {
      label: "Overload amplitude, %",
      type: "number",
      value: 20,
      range: {
        min: 0,
        max: 100,
      },
    },
    overloadCyclePeriod: {
      label: "Overload cycle period, sec",
      type: "number",
      range: {
        min: 30,
        max: 120,
      },
      value: 60,
    },
    startingTorque: {
      label: "Starting torque as *T_rated",
      type: "number",
      value: 0,
      range: {
        min: 0,
        max: 20,
      },
      precision: 1,
      advanced: true,
    },
    ratedSpeed: {
      ...RatedSpeedParam,
      value: (conveyor) => conveyor.maximumSpeed,
    },
    powerOnShaft: {
      ...PowerOnShaftParam,
      value: (conveyor) => (conveyor.ratedSpeed / 9.55) * conveyor.ratedTorque,
    },
    torqueOverload: {
      ...TorqueOverloadParam,
      value: (conveyor) =>
        conveyor.ratedTorque * (1 + conveyor.overloadAmplitude / 100),
    },
    dutyCorrection: {
      ...DutyCorrectionParam,
    },
  },
};
