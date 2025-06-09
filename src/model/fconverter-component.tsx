import { ComponentModel } from "./component";
import {
  DepthParam,
  DesignationParam,
  FootprintParam,
  HeightParam,
  PriceParam,
  VolumeParam,
  WeightParam,
  WidthParam,
} from "./component-params";
import { FcCoolingType, FcProtectionType } from "./cooling-protection";
import { EfficiencyXXXParams } from "./efficiency-component";
import { RatedPowerParam } from "./emachine";
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
    ...PriceParam,
    ...RatedPowerParam,
    voltage: {
      label: "Voltage, V",
      render: (v) => v.min + "-" + v.max,
    },
    workingVoltage: {
      label: "Working voltage, V",
    },
    currentHO: {
      label: "Rated current HO, A",
      precision: 2,
      advanced: true,
    },
    currentLO: {
      label: "Rated current LO, A",
      precision: 2,
      advanced: true,
    },
    cooling: {
      label: "Cooling",
    },
    ...EfficiencyXXXParams,
    cosFi100: {
      label: "cos_fi @ rated load",
      advanced: true,
      precision: 4,
    },
    gridSideFilter: {
      label: "Grid side filter",
      advanced: true,
      render: (v) => (v == null ? "no" : v.designation),
    },
    machineSideFilter: {
      label: "Machine side filter",
      advanced: true,
      render: (v) => (v == null ? "no" : v.designation),
    },
    mounting: {
      label: "Mounting variant",
    },
    protection: {
      label: "Protection",
      advanced: true,
    },
    ...HeightParam,
    ...WidthParam,
    ...DepthParam,
    ...VolumeParam,
    ...FootprintParam,
    ...WeightParam,
    ...DesignationParam,
  },
};
