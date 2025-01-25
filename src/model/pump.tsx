import icon from "../images/el-pump.svg";
import { PumpFc } from "./pump-system";
import { System, SystemElement } from "./system";

const PumpType = ["centrifugal", "positive displacement"] as const;

export type Pump = {
  type: (typeof PumpType)[number];
  head: number;
  ratedSpeed: number;
  flow: number;
  fluidDensity: number;
  ratedEfficiency: number;
  minimalSpeed: number;
  startingTorque: number;
  // calculated
  powerOnShaft: number;
  ratedTorque: number;
  torqueOverload: number;
};

export const PumpElement: SystemElement<Pump> = {
  icon,
  params: {
    type: {
      label: "Type",
      type: "text",
      value: "centrifugal",
      options: [...PumpType],
    },
    head: {
      label: "Head, m",
      type: "number",
      range: {
        min: 0,
        max: 1000,
      },
      value: 200,
    },
    flow: {
      label: "Flow, l/s",
      type: "number",
      range: {
        min: 0,
        max: 500,
      },
      value: 50,
    },
    fluidDensity: {
      label: "Fluid",
      type: "number",
      range: {
        min: 500,
        max: 3200,
      },
      value: 1000,
      advanced: true,
    },
    ratedEfficiency: {
      label: "Rated efficiency, %",
      type: "number",
      range: {
        min: 0,
        max: 100,
      },
      value: 81,
    },
    ratedSpeed: {
      label: "Rated speed, rpm",
      type: "number",
      range: {
        min: 1,
        max: 3500,
      },
      value: 1450,
    },
    minimalSpeed: {
      label: "Minimal speed, rpm",
      type: "number",
      range: {
        min: 0,
        max: 3500,
      },
      value: 0,
    },
    startingTorque: {
      label: "Starting torque as *T_rated",
      type: "number",
      range: {
        min: 0,
        max: 20,
      },
      value: 0.0,
      options: [...Array(21)].map((_, i) => (i * 0.1).toFixed(1)),
      advanced: true,
    },
    powerOnShaft: {
      label: "Power on shaft, kW",
      type: "number",
      precision: 0,
      value: function (pump: Pump): number {
        const flowM3h = (pump.flow * 3600) / 1000;
        const powerOnShaft =
          (flowM3h * pump.fluidDensity * 9.81 * pump.head) /
          (pump.ratedEfficiency * 3.6 * 10000);

        return powerOnShaft;
      },
    },
    ratedTorque: {
      label: "Rated torque, Nm",
      type: "number",
      precision: 0,
      value: function (pump: Pump): number {
        const ratedTorque =
          (1000 * (pump.powerOnShaft * 9.55)) / pump.ratedSpeed;

        return ratedTorque;
      },
    },
    torqueOverload: {
      label: "Torque overload, Nm",
      type: "number",
      precision: 0,
      value: function (pump: Pump): number {
        return pump.ratedTorque * pump.startingTorque;
      },
    },
  },
};

export function calculatePump(pump: Pump) {
  const flowM3h = (pump.flow * 3600) / 1000;
  const powerOnShaft =
    (flowM3h * pump.fluidDensity * 9.81 * pump.head) /
    (pump.ratedEfficiency * 3.6 * 10000);

  const ratedTorque = (1000 * (powerOnShaft * 9.55)) / pump.ratedSpeed;
  const torqueOverload = ratedTorque * pump.startingTorque;

  return { powerOnShaft, ratedTorque, torqueOverload };
}
