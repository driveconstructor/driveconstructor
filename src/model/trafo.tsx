import { StaticImageData } from "next/image";
import icon3w from "../images/el-trafo-3-winding.svg";
import iconMw from "../images/el-trafo-multi-winding.svg";
import icon from "../images/el-trafo.svg";
import {
  EMachineProtectionModel,
  EMachineProtectionType,
  FcCoolingModel,
  FcCoolingType,
} from "./cooling-protection";
import { Environment, EnvironmentModel } from "./environment";
import { SystemElement } from "./system";
export const TrafoVoltageHV = [
  "2200-2500",
  "2500-2800",
  "2800-3200",
  "3200-3400",
  "3400-4100",
  "4100-4300",
  "4300-5800",
  "5800-6800",
  "6800-9000",
  "9000-12000",
] as const satisfies string[];

export const Power = [
  75, 93, 100, 112.5, 118, 145, 150, 160, 175, 190, 220, 225, 240, 250, 275,
  300, 315, 330, 400, 440, 500, 550, 630, 660, 750, 800, 1000, 1250, 1500, 1600,
  2000, 2500, 3150, 3750, 5000, 7500, 10000, 12000, 15000,
] as const;
export const Winding = ["2-winding", "3-winding", "multi-winding"] as const;
export const Integration = ["stand-alone", "integrated"] as const;
export const DryOil = ["dry", "oil-immersed"] as const;
export const VoltageLV = [
  "380-440",
  "650-700",
  "2200-2550",
  "2950-3450",
  "3750-4350",
  "5400-6300",
  "6300-6900",
  "9000-9900",
  "9900-11500",
] as const;

export type PowerTypeAlias = (typeof Power)[number];
export type TypeIIAlias = (typeof DryOil)[number];
export type TypeIIIAlias = (typeof Winding)[number];
export type TypeIVAlias = (typeof Integration)[number];
export type VoltageLVAlias = (typeof VoltageLV)[number];

export type Trafo = {
  ratedPower: PowerTypeAlias | null;
  sideVoltageHV: number;
  typeII: TypeIIAlias;
  typeIII: TypeIIIAlias;
  typeIV: TypeIVAlias;
  ratio: number;
  sideVoltageLV: VoltageLVAlias;
  tappings: number;
  protection: EMachineProtectionType;
  cooling: FcCoolingType;
  // calculated
  overallCurrentDerating: number;
  voltageDerating: number;
} & Environment;

export const TrafoElement: SystemElement<Trafo> = {
  icon,
  params: {
    ratedPower: {
      label: "Rated power, kVA",
      type: "number",
      value: null,
      options: [null, ...Power],
      advanced: true,
    },
    sideVoltageHV: {
      type: "number",
      label: "Voltage (HV)",
      value: 400,
      disabled: true, // set by grid.voltage
    },
    ratio: {
      label: "Transformation ratio",
      type: "number",
      disabled: true,
      value: -1,
      precision: 2,
    },
    sideVoltageLV: {
      label: "Voltage (LV)",
      type: "text",
      value: "650-700",
      options: [...VoltageLV],
    },
    typeII: {
      label: "Dry or oil-immersed",
      type: "text",
      value: "dry",
      options: [...DryOil],
      advanced: true,
    },
    typeIII: {
      label: "Windings",
      type: "text",
      value: "2-winding",
      options: [...Winding],
      advanced: true,
    },
    typeIV: {
      label: "Integrated or stand-alone",
      type: "text",
      options: [...Integration],
      value: "stand-alone",
      advanced: true,
    },
    tappings: {
      label: "Tappings",
      type: "text",
      options: [0, 0.05, 0.025, -0.05, -0.025],
      optionLabels: ["0", "+5%", "+2.5%", "-2.5%", "-5%"],
      value: 0,
      advanced: true,
    },
    ...FcCoolingModel,
    protection: { ...EMachineProtectionModel.protection, value: "IP54/55" },
    ...EnvironmentModel,
    overallCurrentDerating: {
      label: "Overall current derating",
      type: "number",
      precision: 4,
      value: (trafo) => {
        const deratingA =
          trafo.altitude > 1000 ? 1 - 0.00008 * (trafo.altitude - 1000) : 1;

        let deratingT = 1;
        let deratingC = 1;

        if (trafo.cooling === "air") {
          if (trafo.ambientTemperature > 40) {
            deratingT = 1 - 0.008 * (trafo.ambientTemperature - 40);
          }
        } else if (trafo.cooling === "water") {
          if (trafo.coolantTemperature > 35) {
            deratingC = 1 - 0.008 * (trafo.coolantTemperature - 35);
          } else {
            deratingC = 1 + 0.008 * (trafo.coolantTemperature - 35);
          }
          if (trafo.ambientTemperature > 40) {
            deratingT = 1 - 0.004 * (trafo.ambientTemperature - 40);
          } else {
            deratingT = 1 + 0.004 * (trafo.ambientTemperature - 40);
          }
        }

        const derating1 = deratingA * deratingC;
        const derating2 = deratingA * deratingT;

        return derating1 <= derating2 ? derating1 : derating2;
      },
    },
    voltageDerating: {
      label: "Voltage derating",
      type: "number",
      precision: 4,
      value: (trafo) =>
        trafo.altitude > 2000 ? 1 - 0.00015 * (trafo.altitude - 2000) : 1,
    },
  },
  customize(model, system) {
    return {
      ...model,
      icon: customizeIcon(system.typeIII),
    };
  },
};

function customizeIcon(type: TypeIIIAlias): StaticImageData {
  switch (type) {
    case "3-winding":
      return icon3w;
    case "multi-winding":
      return iconMw;
    default:
      return icon;
  }
}
