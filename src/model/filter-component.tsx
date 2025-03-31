import {
  FConverterMountingType,
  FConverter,
  GridSideFilterType,
  MachineSideFilterType,
} from "./fconverter";
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

export function findFiler(
  type: GridSideFilterType | MachineSideFilterType,
  emachineWorkingCurrent: number,
  fconverterRatedVoltage: number,
): FilterComponent | null {
  if (type == "no") {
    return null;
  }

  return filters
    .filter(
      (f) =>
        f.type == (type == "choke+RFI" ? "rfi" : type) &&
        f.voltageMax >= fconverterRatedVoltage &&
        f.current >= emachineWorkingCurrent,
    )
    .sort((a, b) => a.voltageMax - b.voltageMax || a.current - b.current)[0];
}
