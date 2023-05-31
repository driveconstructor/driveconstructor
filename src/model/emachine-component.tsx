import { ComponentModel } from "./component";
import {
  EMachineCooling,
  EMachineFrameMaterial,
  EMachineMounting,
  EMachineProtection,
  EMachineType,
  ERatedPower,
  EfficiencyClass,
} from "./emachine";
import {
  ERatedSynchSpeed,
  TypeSpeedAndTorque,
  VoltageY,
} from "./emachine-sizing";

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
    price: {
      label: "Price, EUR",
    },
    ratedPower: {
      label: "Rated power, kW",
    },
    ratedSpeed: {
      label: "Rated speed, rpm",
    },
    ratedSynchSpeed: {
      label: "Rated synchronous speed, rpm",
    },
    maximumSpeed: {
      label: "Maximum speed, rpm",
    },
    ratedVoltageY: {
      label: "Voltage, V",
      render: (v) => `${v.min}-${v.max}`,
    },
    efficiencyClass: {
      label: "Efficiency class",
    },
    efficiency100: {
      label: "Efficiency @100% load",
    },
    efficiency75: {
      label: "Efficiency @75% load",
    },
    efficiency50: {
      label: "Efficiency @50% load",
    },
    efficiency25: {
      label: "Efficiency @25% load",
    },
    ratedCurrent: {
      label: "Rated current, A",
    },
    ratedTorque: {
      label: "Working current, A",
    },
    workingCurrent: {
      label: "Rated torque, Nm",
    },
    torqueOverload: {
      label: "Torque overload",
    },
    cosFi100: {
      label: "cos_fi @ rated load",
    },
    cosFi75: {
      label: "cos_fi @ 75% load",
    },
    cosFi50: {
      label: "cos_fi @ 50% load",
    },
    cooling: {
      label: "Cooling",
    },
    mounting: {
      label: "Mounting",
    },
    protection: {
      label: "Protection",
    },
    frameMaterial: {
      label: "Frame material",
    },
    shaftHeight: {
      label: "Shaft height, mm",
    },
    outerDiameter: {
      label: "Outer diameter, m",
    },
    length: {
      label: "Axial length, m",
    },
    volume: {
      label: "Volume, m3",
    },
    momentOfInertia: {
      label: "Moment of inertia, kgm2",
    },
    footPrint: {
      label: "Footprint, m2",
    },
    weight: {
      label: "Weight, kg",
    },
    designation: {
      label: "Designation",
    },
  },
};

export function generate(
  tst: TypeSpeedAndTorque,
  voltageY: VoltageY
): EMachineComponent[] {
  return [];
}
