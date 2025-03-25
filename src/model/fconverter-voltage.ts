import { closest } from "./utils";

export type FcVoltageY = {
  value: (typeof FcVoltage)[number];
  min: number;
  max: number;
  type: "LV" | "MV1" | "MV2";
};

const LowVoltage = [400, 660];
const MediumVoltage1 = [2460, 3300, 4160];
const MediumVoltage2 = [6000, 6600, 10000, 11000];

export const FcVoltage = [
  ...LowVoltage,
  ...MediumVoltage1,
  ...MediumVoltage2,
] as const satisfies number[];

export function findFcVoltageY(voltage: number): FcVoltageY {
  const value = closest(FcVoltage, voltage) as (typeof FcVoltage)[number];

  const type =
    LowVoltage.findIndex((v) => v == value) != -1
      ? "LV"
      : MediumVoltage1.findIndex((v) => v == value) != -1
        ? "MV1"
        : "MV2";

  return { min: value * 0.9, value, max: value * 1.05, type };
}
