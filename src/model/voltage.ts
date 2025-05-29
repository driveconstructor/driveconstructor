export type VoltageYType = "LV" | "MV";

export type VoltageY<V = VoltageYType> = {
  value: number;
  min: number;
  max: number;
  type: V;
};

const LowVoltage = [400, 660];
const MediumVoltage = [3300, 6600, 10000];

export const Voltage = [...LowVoltage, ...MediumVoltage];

export function isIn(array: number[], value: number) {
  return value <= array[array.length - 1] && value >= array[0];
}

export function findVoltageY(voltage: number): VoltageY | null {
  const value = Voltage.find((v) => v * 1.05 >= voltage);
  if (value == null) {
    return null;
  }

  return {
    min: Math.round(value * 0.9),
    value,
    max: Math.round(value * 1.1),
    type: isIn(LowVoltage, value) ? "LV" : "MV",
  };
}
