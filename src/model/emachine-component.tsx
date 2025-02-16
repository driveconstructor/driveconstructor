import { ComponentModel } from "./component";
import {
  DesignationParam,
  FootPrintParam,
  MountingParam,
  PriceParam,
  VolumeParam,
  WeightParam,
} from "./component-params";
import { CoolingParam, ProtectionParam } from "./cooling-protection";
import {
  EMachineCooling,
  EMachineFrameMaterial,
  EMachineMounting,
  EMachineProtection,
  EMachineType,
  ERatedPower,
  EfficiencyClass,
  RatedPowerParam,
} from "./emachine";
import { ERatedSynchSpeed, TypeSpeedTorque } from "./emachine-sizing";
import { VoltageY } from "./voltage";

export const InsulationClass = ["B", "H", "F"];

export type EMachineComponent = {
  type: (typeof EMachineType)[number];
  price: number;
  ratedPower: (typeof ERatedPower)[number];
  ratedSpeed: number;
  ratedSynchSpeed: (typeof ERatedSynchSpeed)[number];
  maximumSpeed: number;
  ratedVoltageY: VoltageY;
  efficiencyClass: (typeof EfficiencyClass)[number];
  efficiency100: number;
  efficiency75: number;
  efficiency50: number;
  efficiency25: number;
  ratedCurrent: number;
  ratedTorque: number;
  workingCurrent: number;
  torqueOverload: number;
  cosFi100: number;
  cosFi75: number;
  cosFi50: number;
  mounting: (typeof EMachineMounting)[number];
  cooling: (typeof EMachineCooling)[number];
  protection: (typeof EMachineProtection)[number];
  frameMaterial: (typeof EMachineFrameMaterial)[number];
  shaftHeight: number;
  outerDiameter: number;
  length: number;
  volume: number;
  momentOfInertia: number;
  footPrint: number;
  weight: number;
  designation: string;
};

export const EMachineComponentModel: ComponentModel<EMachineComponent> = {
  kind: "emachine",
  title: "Electric machine",
  params: {
    type: {
      label: "Type",
    },
    ...PriceParam,
    ...RatedPowerParam,
    ratedSpeed: {
      label: "Rated speed, rpm",
    },
    ratedVoltageY: {
      label: "Voltage, V",
      render: (v) => `${v.min.toFixed(0)}-${v.max.toFixed(0)}`,
    },
    ratedSynchSpeed: {
      label: "Rated synchronous speed, rpm",
      advanced: true,
    },
    maximumSpeed: {
      label: "Maximum speed, rpm",
      advanced: true,
    },
    efficiencyClass: {
      label: "Efficiency class",
      advanced: true,
    },
    efficiency100: {
      label: "Efficiency @100% load",
    },
    efficiency75: {
      label: "Efficiency @75% load",
      advanced: true,
    },
    efficiency50: {
      label: "Efficiency @50% load",
      advanced: true,
    },
    efficiency25: {
      label: "Efficiency @25% load",
      advanced: true,
    },
    ratedCurrent: {
      label: "Rated current, A",
      render: (v) => v.toFixed(0),
    },
    ratedTorque: {
      label: "Rated torque, Nm",
      advanced: true,
    },
    workingCurrent: {
      label: "Rated torque, Nm",
      advanced: true,
    },
    torqueOverload: {
      label: "Torque overload",
      advanced: true,
    },
    cosFi100: {
      label: "cos_fi @ rated load",
      advanced: true,
    },
    cosFi75: {
      label: "cos_fi @ 75% load",
      advanced: true,
    },
    cosFi50: {
      label: "cos_fi @ 50% load",
      advanced: true,
    },
    ...CoolingParam,
    mounting: { ...MountingParam.mounting, advanced: true },
    ...ProtectionParam,
    frameMaterial: {
      label: "Frame material",
    },
    shaftHeight: {
      label: "Shaft height, mm",
      advanced: true,
    },
    outerDiameter: {
      label: "Outer diameter, m",
      advanced: true,
    },
    length: {
      label: "Axial length, m",
      advanced: true,
    },
    ...VolumeParam,
    momentOfInertia: {
      label: "Moment of inertia, kgm2",
      advanced: true,
    },
    ...FootPrintParam,
    ...WeightParam,
    ...DesignationParam,
  },
};
