import { FConverterMountingType, FConvertor } from "./fconvertor";
import { FConvertorComponent } from "./fconvertor-component";
import json from "./filter-catalog.json";

const FilterType = ["du/dt", "rfi", "sin"] as const;

type FilterComponent = {
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
};

export const filters = json as FilterComponent[];

export function findFilters(
  workingCurrent: number,
  fconvertorRatedVoltage: number,
) {
  // todo: implement
  filters.filter(
    (f) =>
      f.voltageMax >= fconvertorRatedVoltage && f.current >= workingCurrent,
  );
}
