import iconPMSM from "../images/el-emachine-pmsm.svg";
import iconSCIM from "../images/el-emachine-scim.svg";
import iconSyRM from "../images/el-emachine-syrm.svg";
import icon from "../images/el-emachine.svg";
import {
  CoolingParam,
  EMachineProtection,
  EMachineProtectionType,
  ProtectionParam,
} from "./cooling-protection";
import { Environment, EnvironmentModel } from "./environment";
import { SystemElement } from "./system";

export const EMachineType = ["SCIM", /*'DFIM',*/ "PMSM", "SyRM"] as const;
export const ERatedPower = [
  1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110,
  132, 160, 200, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900,
  1000, 1250, 1400, 1600, 2000, 2500, 3150, 4000, 5000,
] as const;
export const EfficiencyClass = ["IE2", "IE3", "IE4"] as const;
export type EfficiencyClassType = (typeof EfficiencyClass)[number];
export const EMachineMounting = ["B3", "B5", "B35"] as const;
export const EMachineCooling = ["IC411", "IC416", "IC71W"] as const;
export const EMachineFrameMaterial = [
  "steel",
  "aluminum",
  "cast iron",
] as const;
export type EMachineFrameMaterialType = (typeof EMachineFrameMaterial)[number];
export const ShaftHeight = [
  56, 63, 71, 80, 90, 100, 112, 132, 160, 180, 200, 225, 250, 280, 315, 355,
  400, 450, 500, 560, 630, 710,
] as const satisfies number[];

export type EMachineCoolingType = (typeof EMachineCooling)[number];

export type EMachineTypeAlias = (typeof EMachineType)[number];

export type EMachineMountingType = (typeof EMachineMounting)[number];

export type EMachine = {
  type: EMachineTypeAlias | null;
  ratedPower: (typeof ERatedPower)[number] | null;
  cooling: EMachineCoolingType;
  protection: EMachineProtectionType;
  frameMaterial: EMachineFrameMaterialType | null;
  efficiencyClass: EfficiencyClassType | null;
  mounting: EMachineMountingType | null;
  shaftHeight: (typeof ShaftHeight)[number] | null;
  // calculated
  overallTorqueDerating: number;
  voltageDerating: number;
} & Environment;

export const RatedPowerParam = {
  ratedPower: {
    label: "Rated power, kW",
    precision: 1,
  },
};

export const EMachineElement: SystemElement<EMachine> = {
  icon,
  params: {
    type: {
      label: "Type",
      type: "text",
      value: "SCIM",
      options: [null, ...EMachineType],
    },
    ratedPower: {
      ...RatedPowerParam.ratedPower,
      type: "number",
      value: null,
      options: [null, ...ERatedPower],
    },
    cooling: {
      ...CoolingParam.cooling,
      type: "text",
      options: [...EMachineCooling],
      optionLabels: [
        "self-ventilation",
        "air forced ventilation",
        "water cooled",
      ],
      value: "IC411",
    },
    protection: {
      ...ProtectionParam.protection,
      type: "text",
      options: [...EMachineProtection],
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
      value: "IE4",
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
      options: [null, ...ShaftHeight],
      value: null,
      advanced: true,
    },
    overallTorqueDerating: {
      label: "Overall torque derating",
      type: "number",
      precision: 4,
      value: (em) => {
        const deratingA =
          em.altitude > 1000 ? 1 - 0.00008 * (em.altitude - 1000) : 1;

        if (em.cooling == "IC411" || em.cooling == "IC416") {
          if (em.ambientTemperature > 40) {
            const deratingT = 1 - 0.008 * (em.ambientTemperature - 40);
            return deratingA * deratingT;
          }

          return deratingA;
        }

        if (em.cooling == "IC71W" && em.protection == "IP21/23") {
          const deratingC = 1 - 0.008 * (em.coolantTemperature - 35);
          const deratingT = 1 - 0.004 * (em.ambientTemperature - 40);

          const derating1 = deratingA * deratingC;
          const derating2 = deratingA * deratingT;

          return Math.min(derating1, derating2);
        }

        if (em.cooling == "IC71W" && em.protection == "IP54/55") {
          const deratingT = 1 - 0.008 * (em.coolantTemperature - 35);
          return deratingA * deratingT;
        }

        throw new Error("Invalid combination");
      },
    },
    voltageDerating: {
      label: "Voltage derating",
      type: "number",
      precision: 4,
      value: (em) =>
        em.altitude > 1000 ? 1 - 0.00015 * (em.altitude - 1000) : 1,
    },
  },
  customize: (model, value) => {
    if (value.type == null) {
      return model;
    }

    return { ...model, icon: customizeIcon(value.type) };
  },
};

function customizeIcon(type: (typeof EMachineType)[number]) {
  switch (type) {
    case "SCIM":
      return iconSCIM;
    case "PMSM":
      return iconPMSM;
    case "SyRM":
      return iconSyRM;
  }
}
