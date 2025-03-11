import { ComponentModel } from "./component";
import {
  DesignationParam,
  FootprintParam,
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
  footprint: number;
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
      precision: 2,
    },
    efficiency75: {
      label: "Efficiency @75% load",
      precision: 2,
      advanced: true,
    },
    efficiency50: {
      label: "Efficiency @50% load",
      precision: 2,
      advanced: true,
    },
    efficiency25: {
      label: "Efficiency @25% load",
      precision: 2,
      advanced: true,
    },
    ratedCurrent: {
      label: "Rated current, A",
    },
    ratedTorque: {
      label: "Rated torque, Nm",
      advanced: true,
    },
    workingCurrent: {
      label: "Working current, A",
      advanced: true,
    },
    torqueOverload: {
      label: "Torque overload",
      advanced: true,
      precision: 2,
    },
    cosFi100: {
      label: "cos_fi @ rated load",
      advanced: true,
      precision: 4,
    },
    cosFi75: {
      label: "cos_fi @ 75% load",
      advanced: true,
      precision: 4,
    },
    cosFi50: {
      label: "cos_fi @ 50% load",
      advanced: true,
      precision: 4,
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
      precision: 2,
    },
    length: {
      label: "Axial length, m",
      advanced: true,
      precision: 2,
    },
    ...VolumeParam,
    momentOfInertia: {
      label: "Moment of inertia, kgm2",
      advanced: true,
      precision: 2,
    },
    ...FootprintParam,
    ...WeightParam,
    ...DesignationParam,
  },
};
