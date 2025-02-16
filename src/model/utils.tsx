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

export function closest(array: number[], value: number): number {
  return array.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
  );
}

export function round(v: number): number {
  const r = (v: number, n: number) => parseFloat(v.toFixed(n));

  return v < 1 ? r(v, 4) : r(v, 0);
}
