export type VoltageY = {
  value: (typeof Voltage)[number];
  min: number;
  max: number;
  type: "LV" | "MV";
};

export const LowVoltage = [400, 660] as const;

export const MediumVoltage = [3300, 6600, 10000] as const;

export const Voltage = [...LowVoltage, ...MediumVoltage];

export function findVoltageY(deratedVoltage: number): VoltageY {
  const value = [...Voltage].sort(
    (a, b) => Math.abs(a - deratedVoltage) - Math.abs(b - deratedVoltage),
  )[0];

  const type = LowVoltage.findIndex((v) => v == value) != -1 ? "LV" : "MV";

  return { min: value * 0.9, value, max: value * 1.1, type };
}
