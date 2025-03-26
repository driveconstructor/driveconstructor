import { closest } from "./utils";

export type VoltageY = {
  value: (typeof Voltage)[number];
  min: number;
  max: number;
  type: "LV" | "MV";
};

const LowVoltage = [400, 660];

const MediumVoltage = [3300, 6600, 10000];

export const Voltage = [...LowVoltage, ...MediumVoltage];

export function findVoltageY(deratedVoltage: number): VoltageY {
  const value = closest(Voltage, deratedVoltage) as (typeof Voltage)[number];

  const type = LowVoltage.includes(value) ? "LV" : "MV";

  return { min: value * 0.9, value, max: value * 1.1, type };
}
