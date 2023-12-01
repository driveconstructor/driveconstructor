import assert from "assert";

export type Range = {
  min: number;
  max: number;
};

export function splitRange(value: string): Range {
  const a = value.split("-");
  assert(a.length == 2);

  const result = { min: Number(a[0]), max: Number(a[1]) };
  assert(result.max >= result.min);
  return result;
}
