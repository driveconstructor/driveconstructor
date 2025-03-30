import { ComponentModel } from "./component";
import { FcCoolingType, FcProtectionType } from "./cooling-protection";
import {
  FConverterMounting,
  FConverterPower,
  FConverterTypeAlias,
} from "./fconverter";
import { FcVoltageY } from "./fconverter-voltage";
import { FilterComponent } from "./filter-component";

export type FConverterComponent = {
  voltage: FcVoltageY;
  price: number;
  workingVoltage: number;
  currentLO: number;
  currentHO: number;
  efficiency100: number;
  cosFi100: number;
  height: number;
  width: number;
  depth: number;
  weight: number;
  gridSideFilter: FilterComponent | null;
  machineSideFilter: FilterComponent | null;
  efficiency75: number;
  efficiency50: number;
  efficiency25: number;
  footprint: number;
  volume: number;
  ratedPower: (typeof FConverterPower)[number];
  mounting: (typeof FConverterMounting)[number];
  cooling: FcCoolingType;
  protection: FcProtectionType;
  designation: string;
  type: FConverterTypeAlias;
};

export const FConverterComponentModel: ComponentModel<FConverterComponent> = {
  kind: "fconverter",
  title: "Frequency converter",
  params: {
    type: {
      label: "Type",
    },
    price: {
      label: "Price, EUR",
    },
    ratedPower: {
      label: "Rated power, kW",
    },
    voltage: {
      label: "Voltage, V",
      render: (v) => v.min + "-" + v.max,
    },
    workingVoltage: {
      label: "Working voltage, V",
    },
    currentLO: {
      label: "Rated current LO, A",
      precision: 2,
      advanced: true,
    },
    currentHO: {
      label: "Rated current HO, A",
      precision: 2,
      advanced: true,
    },
    cooling: {
      label: "Cooling",
    },
    efficiency100: {
      label: "Efficiency @100% load",
    },
    efficiency75: {
      label: "Efficiency @75% load",
      advanced: true,
    },
    efficiency50: {
      label: "Efficiency @50% load",
      advanced: true,
    },
    efficiency25: {
      label: "Efficiency @25% load",
      advanced: true,
    },
    cosFi100: {
      label: "cos_fi @ rated load",
      advanced: true,
    },
    gridSideFilter: {
      label: "Grid side filter",
      advanced: true,
      render: (v) => v?.designation,
    },
    machineSideFilter: {
      label: "Machine side filter",
      advanced: true,
      render: (v) => v?.designation,
    },
    mounting: {
      label: "Mounting variant",
    },
    protection: {
      label: "Protection",
      advanced: true,
    },
    height: {
      label: "Height, m",
    },
    width: {
      label: "Width, m",
    },
    depth: {
      label: "Depth, m",
    },
    volume: {
      label: "Volume, m3",
    },
    footprint: {
      label: "Footprint, m2",
    },
    weight: {
      label: "Weight, kg",
    },
    designation: {
      label: "Designation",
    },
  },
};
