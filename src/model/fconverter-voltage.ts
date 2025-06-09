import { isIn, VoltageY } from "./voltage";
export type FcVoltageYType = "LV" | "MV1" | "MV2" | "LVX";
export type FcVoltageY = VoltageY<FcVoltageYType>;

const LowVoltage = [400, 660];
const MediumVoltage1 = [2460, 3300, 4160];
const MediumVoltage2 = [6000, 6600, 10000, 11000];

export const FcVoltage = [...LowVoltage, ...MediumVoltage1, ...MediumVoltage2];

export function findFcVoltageY(voltage: number): FcVoltageY | null {
  let type: FcVoltageYType;
  if (isIn(LowVoltage, voltage)) {
    type = "LV";
  } else if (isIn(MediumVoltage1, voltage)) {
    type = "MV1";
  } else if (isIn(MediumVoltage2, voltage)) {
    type = "MV2";
  } else {
    return null;
  }

  const value = FcVoltage.find((v) => v >= voltage);
  if (value == null) {
    return null;
  }

  return {
    min: Math.round(value * 0.9),
    value,
    max: Math.round(value * 1.05),
    type,
  };
}
