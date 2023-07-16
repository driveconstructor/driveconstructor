import icon from "../images/el-fconverter.svg";

import icon_2Q_2L_VSC_12p from "../images/el-fconverter-2Q-2L-VSC-12p.svg";
import icon_2Q_2L_VSC_6p from "../images/el-fconverter-2Q-2L-VSC-6p.svg";
import icon_2Q_3L_NPC_VSC from "../images/el-fconverter-2Q-3L-NPC-VSC.svg";
import icon_2Q_ML_SCHB_VSC from "../images/el-fconverter-2Q-ML-SCHB-VSC.svg";
import icon_4Q_2L_VSC from "../images/el-fconverter-4Q-2L-VSC.svg";
import icon_4Q_3L_NPC_VSC from "../images/el-fconverter-4Q-3L-NPC-VSC.svg";
import icon_4Q_ML_SCHB_VSC from "../images/el-fconverter-4Q-ML-SCHB-VSC.svg";

import { StaticImageData } from "next/image";
import { Environment, EnvironmentModel } from "./environment";
import { SystemElement } from "./system";

export const FConverterMounting = ["wall", "floor"] as const;

export const FConverterProtection = ["IP21/31", "IP54/55"] as const;

export const FConverterType = [
  "2Q-2L-VSC-6p",
  "2Q-2L-VSC-12p",
  "2Q-3L-NPC-VSC",
  "2Q-ML-SCHB-VSC",
  "4Q-2L-VSC",
  "4Q-3L-NPC-VSC",
  "4Q-ML-SCHB-VSC",
] as const;

export const FConverterPower = [
  0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90,
  110, 132, 160, 200, 250, 315, 355, 400, 450, 500, 630, 710, 800, 900, 1000,
  1120, 1250, 1400, 1600, 1800, 2000, 2200, 2500, 2800, 3000, 3300, 3600, 3800,
  4000, 4500, 4700, 5000, 5200, 5500,
] as const;

export const FConverterCooling = ["air", "water"] as const;

export const GridSideFilter = ["no", "choke", "sin", "choke+RFI"] as const;

export const MachineSideFilter = ["no", "choke", "du/dt", "sin"] as const;

export type FConvertorTypeAlias = (typeof FConverterType)[number];
export type GridSideFilterAlias = (typeof GridSideFilter)[number];
export type MachineSideFilterAlias = (typeof MachineSideFilter)[number];

export type FConvertor = {
  type: FConvertorTypeAlias;
  ratedPower: (typeof FConverterPower)[number] | null;
  gridSideFilter: GridSideFilterAlias;
  machineSideFilter: MachineSideFilterAlias;
  cooling: (typeof FConverterCooling)[number];
  mounting: (typeof FConverterMounting)[number] | null;
  protection: (typeof FConverterProtection)[number];
} & Environment;

export const NoTrafoFConvertorElement = FConvertorElement([
  "2Q-2L-VSC-6p",
  "4Q-2L-VSC",
]);

function FConvertorElement(
  types: FConvertorTypeAlias[],
): SystemElement<FConvertor> {
  return {
    icon,
    params: {
      type: {
        label: "Type",
        type: "text",
        options: [...types],
        value: types[0],
      },
      ratedPower: {
        label: "Rated power (low overload), kW",
        type: "number",
        options: [null, ...FConverterPower],
        value: null,
      },
      gridSideFilter: {
        label: "Grid side filter",
        type: "text",
        options: [...GridSideFilter],
        value: "no",
        advanced: true,
      },
      machineSideFilter: {
        label: "Machine side filter",
        type: "text",
        options: [...MachineSideFilter],
        value: "no",
        advanced: true,
      },
      mounting: {
        label: "Mounting variant",
        type: "text",
        options: [null, ...FConverterMounting],
        value: null,
      },
      protection: {
        label: "Protection",
        type: "text",
        options: [...FConverterProtection],
        value: "IP21/31",
        advanced: true,
      },
      cooling: {
        label: "Cooling",
        type: "text",
        options: [...FConverterCooling],
        value: "air",
      },
      ...EnvironmentModel,
    },
    customize(model, system) {
      const iconWidth = system.type.indexOf("SCHB") == -1 ? 160 : 80;
      const filters = customizeFilters(system.type);

      return {
        ...model,
        icon: customizeIcon(system.type),
        iconWidth,
        params: {
          ...model.params,
          gridSideFilter: {
            ...model.params.gridSideFilter,
            options: filters.grid,
            value: filters.grid[0],
          },
          machineSideFilter: {
            ...model.params.machineSideFilter,
            options: filters.machine,
            value: filters.machine[0],
          },
        },
      };
    },
  };
}

function customizeFilters(type: FConvertorTypeAlias): {
  grid: GridSideFilterAlias[];
  machine: MachineSideFilterAlias[];
} {
  switch (type) {
    case "2Q-2L-VSC-6p":
    case "2Q-2L-VSC-12p":
      return {
        grid: ["choke", "choke+RFI"],
        machine: ["no", "du/dt", "sin"],
      };
    case "4Q-2L-VSC":
      return {
        grid: ["sin"],
        machine: ["no", "du/dt", "sin"],
      };
    case "2Q-3L-NPC-VSC":
      return {
        grid: ["sin"],
        machine: ["choke"],
      };
    case "4Q-3L-NPC-VSC":
      return {
        grid: ["sin"],
        machine: ["sin"],
      };

    case "2Q-ML-SCHB-VSC":
    case "4Q-ML-SCHB-VSC":
      return {
        grid: ["no"],
        machine: ["no"],
      };
  }
}

function customizeIcon(type: FConvertorTypeAlias): StaticImageData {
  switch (type) {
    case "2Q-2L-VSC-6p":
      return icon_2Q_2L_VSC_6p;
    case "2Q-2L-VSC-12p":
      return icon_2Q_2L_VSC_12p;
    case "2Q-3L-NPC-VSC":
      return icon_2Q_3L_NPC_VSC;
    case "2Q-ML-SCHB-VSC":
      return icon_2Q_ML_SCHB_VSC;
    case "4Q-2L-VSC":
      return icon_4Q_2L_VSC;
    case "4Q-3L-NPC-VSC":
      return icon_4Q_3L_NPC_VSC;
    case "4Q-ML-SCHB-VSC":
      return icon_4Q_ML_SCHB_VSC;
  }
}
