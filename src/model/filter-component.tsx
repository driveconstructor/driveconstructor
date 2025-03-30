import { FConverterMountingType, FConverter } from "./fconverter";
import { FConverterComponent } from "./fconverter-component";
import json from "./filter-catalog.json";

const FilterType = ["du/dt", "rfi", "sin"] as const;

export type FilterComponent = {
  type: (typeof FilterType)[number];
  mounting: FConverterMountingType;
  voltageMax: number;
  current: number;
  voltageDrop: number;
  efficiency: number;
  height: number;
  width: number;
  weight: number;
  volume: number;
  footprint: number;
  protection: "IP21";
  designation: string;
};

export const filters = json as FilterComponent[];

export function findFilters(
  workingCurrent: number,
  fconverterRatedVoltage: number,
) {
  // todo: implement
  filters.filter(
    (f) =>
      f.voltageMax >= fconverterRatedVoltage && f.current >= workingCurrent,
  );
}
