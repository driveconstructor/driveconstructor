import { ComponentModel } from "./component";
import { Cooling, Protection } from "./cooling-protection";
import {
  FConverterMounting,
  FConverterPower,
  FConvertorTypeAlias,
} from "./fconvertor";
import { VoltageY } from "./voltage";

export type FConvertorComponent = {
  voltage: VoltageY;
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
  gridSideFilterDesignation: string;
  machineSideFilterDesignation: string;
  efficiency75: number;
  efficiency50: number;
  efficiency25: number;
  footprint: number;
  volume: number;
  ratedPower: (typeof FConverterPower)[number];
  mounting: (typeof FConverterMounting)[number];
  cooling: (typeof Cooling)[number];
  protection: (typeof Protection)[number];
  designation: string;
  type: FConvertorTypeAlias;
};

export const FConvertorComponentModel: ComponentModel<FConvertorComponent> = {
  kind: "fconvertor",
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
      advanced: true,
    },
    currentHO: {
      label: "Rated current HO, A",
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
    gridSideFilterDesignation: {
      label: "Grid side filter",
      advanced: true,
    },
    machineSideFilterDesignation: {
      label: "Machine side filter",
      advanced: true,
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
