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

export function round(value: number, precision?: number): number {
  return parseFloat(value.toFixed(precision));
}

export function valueDifference(a: number, b: number): number {
  return (Math.abs(b - a) * 2) / (b + a);
}

export function haveSameContent(a: string[], b: string[]) {
  return a.length == b.length && a.every((v) => b.includes(v));
}
