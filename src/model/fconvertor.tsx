import icon2Q_2L_VSC_6p from "../images/el-fconverter-2Q-2L-VSC-6p.svg";
import icon from "../images/el-fconverter.svg";

import { Environment, EnvironmentModel } from "./environment";
import { SystemElement } from "./system";

const FConverterMounting = ["wall", "floor"] as const;

const FConverterProtection = ["IP21/31", "IP54/55"] as const;

const FConverterType = [
  "2Q-2L-VSC-6p",
  "2Q-2L-VSC-12p",
  "2Q-3L-NPC-VSC",
  "2Q-ML-SCHB-VSC",
  "4Q-2L-VSC",
  "4Q-3L-NPC-VSC",
  "4Q-ML-SCHB-VSC",
] as const;

const FConverterPower = [
  0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90,
  110, 132, 160, 200, 250, 315, 355, 400, 450, 500, 630, 710, 800, 900, 1000,
  1120, 1250, 1400, 1600, 1800, 2000, 2200, 2500, 2800, 3000, 3300, 3600, 3800,
  4000, 4500, 4700, 5000, 5200, 5500,
] as const;

const FConverterCooling = ["air", "water"] as const;

const GridSideFilter = ["no", "choke", "sin", "choke+RFI"] as const;

const MachineSideFilter = ["no", "du/dt", "sin"] as const;

export type FConvertor = {
  type: (typeof FConverterType)[number];
  ratedPower: (typeof FConverterPower)[number] | null;
  gridSideFilter: (typeof GridSideFilter)[number];
  machineSideFilter: (typeof MachineSideFilter)[number];
  cooling: (typeof FConverterCooling)[number];
  mounting: (typeof FConverterMounting)[number] | null;
  protection: (typeof FConverterProtection)[number];
} & Environment;

export const FConvertorElement: SystemElement<FConvertor> = {
  icon,
  iconWidth: 160,
  params: {
    type: {
      label: "Type",
      type: "text",
      options: [...FConverterType],
      value: "2Q-2L-VSC-6p",
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
    },
    machineSideFilter: {
      label: "Machine side filter",
      type: "text",
      options: [...MachineSideFilter],
      value: "no",
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
    return { ...model, icon: icon2Q_2L_VSC_6p };
  },
};
