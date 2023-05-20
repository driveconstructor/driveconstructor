import iconPMSM from "../images/el-emachine-pmsm.svg";
import iconSCIM from "../images/el-emachine-scim.svg";
import iconSyRM from "../images/el-emachine-syrm.svg";
import icon from "../images/el-emachine.svg";
import { Environment, EnvironmentModel } from "./environment";
import { SystemElement } from "./system";

const EMachineType = ["SCIM", /*'DFIM',*/ "PMSM", "SyRM"] as const;
const ERatedPower = [
  1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110,
  132, 160, 200, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900,
  1000, 1250, 1400, 1600, 2000, 2500, 3150, 4000, 5000,
];
const EfficiencyClass = ["IE2", "IE3", "IE4"] as const;
const EMachineMounting = ["B3", "B5", "B35"] as const;
const EMachineCooling = ["IC411", "IC416", "IC71W"] as const;
const EMachineProtection = ["IP21/23", "IP54/55"] as const;
const EMachineFrameMaterial = ["steel", "aluminum", "cast iron"] as const;
const ShaftHeight = [
  56, 63, 71, 80, 90, 100, 112, 132, 160, 180, 200, 225, 250, 280, 315, 355,
  400, 450, 500, 560, 630, 710,
];

export type EMachine = {
  type: (typeof EMachineType)[number] | null;
  ratedPower: (typeof ERatedPower)[number] | null;
  cooling: (typeof EMachineCooling)[number] | null;
  protection: (typeof EMachineProtection)[number] | null;
  frameMaterial: (typeof EMachineFrameMaterial)[number] | null;
  efficiencyClass: (typeof EfficiencyClass)[number] | null;
  mounting: (typeof EMachineMounting)[number] | null;
  shaftHeight: (typeof ShaftHeight)[number];
} & Environment;

export const EMachineElement: SystemElement<EMachine> = {
  icon,
  params: {
    type: {
      label: "Type",
      type: "text",
      value: null,
      options: [null, ...EMachineType],
    },
    ratedPower: {
      label: "Rated power, kW",
      type: "number",
      value: 400,
      options: [null, ...ERatedPower],
    },
    cooling: {
      label: "Cooling",
      type: "text",
      options: [null, ...EMachineCooling],
      optionLabels: [
        null,
        "self-ventilation",
        "air forced ventilation",
        "water cooled",
      ],
      value: "IC411",
    },
    protection: {
      label: "Protection",
      type: "text",
      options: [null, ...EMachineProtection],
      value: "IP21/23",
    },
    frameMaterial: {
      label: "Frame material",
      type: "text",
      options: [null, ...EMachineFrameMaterial],
      value: "cast iron",
    },
    efficiencyClass: {
      label: "Efficiency class",
      type: "text",
      options: [null, ...EfficiencyClass],
      value: null,
      advanced: true,
    },
    mounting: {
      label: "Mounting",
      type: "text",
      options: [null, ...EMachineMounting],
      value: "B3",
      advanced: true,
    },
    ...EnvironmentModel,
    shaftHeight: {
      label: "Shaft height, mm",
      type: "number",
      range: {
        min: 56,
        max: 710,
      },
      options: ShaftHeight,
      value: 56,
      advanced: true,
    },
  },
  customize: (model, value) => {
    switch (value.type) {
      case "SCIM":
        return { ...model, icon: iconSCIM };
      case "PMSM":
        return { ...model, icon: iconPMSM };
      case "SyRM":
        return { ...model, icon: iconSyRM };
    }

    return model;
  },
};
