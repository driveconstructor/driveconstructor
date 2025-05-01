import { ShaftHeight } from "./emachine";

export type Range = {
  min: number;
  max: number;
};

export function splitRange(value: string): Range {
  const a = value.split("-");
  if (a.length != 2) {
    throw new Error("invalid format");
  }

  const result = { min: Number(a[0]), max: Number(a[1]) };

  if (isNaN(result.max) || isNaN(result.min) || result.max < result.min) {
    throw new Error("invalid number value");
  }

  return result;
}

export function closest(
  array: number[],
  value: number,
  end?: boolean,
): number | undefined {
  return end
    ? array.sort().find((v) => v >= value)
    : array.sort((a, b) => b - a).find((v) => v <= value);
}

export function round(value: number, precision?: number): number {
  return parseFloat(value.toFixed(precision));
}

export function valueDifference(a: number, b: number): number {
  return (Math.abs(b - a) * 2) / (b + a);
}
