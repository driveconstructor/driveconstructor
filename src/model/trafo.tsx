import { Environment } from "./environment";
import { SystemElement } from "./system";
import icon from "../images/el-trafo.svg";
import icon3w from "../images/el-trafo-3-winding.svg";
import iconMw from "../images/el-trafo-multi-winding.svg";
import { StaticImageData } from "next/image";

export const Power = [
  75, 93, 100, 112.5, 118, 145, 150, 160, 175, 190, 220, 225, 240, 250, 275,
  300, 315, 330, 400, 440, 500, 550, 630, 660, 750, 800, 1000, 1250, 1500, 1600,
  2000, 2500, 3150, 3750, 5000, 7500, 10000, 12000, 15000,
] as const;
export const Winding = ["2-winding", "3-winding", "multi-winding"] as const;
export const Integration = ["stand-alone", "integrated"] as const;
export const DryOil = ["dry", "oil-immersed"] as const;

export type PowerTypeAlias = (typeof Power)[number];
export type TypeIIAlias = (typeof DryOil)[number];
export type TypeIIIAlias = (typeof Winding)[number];

export type Trafo = {
  sideVoltageHV: number;
  ratedPower: PowerTypeAlias | null;
  typeII: TypeIIAlias;
  typeIII: TypeIIIAlias;
}; // & Environment;

export const TrafoElement: SystemElement<Trafo> = {
  icon,
  params: {
    sideVoltageHV: {
      type: "number",
      label: "Voltage (HV)",
      value: 400,
      disabled: true, // set by grid.voltage
    },
    ratedPower: {
      label: "Rated power, kVA",
      type: "number",
      value: null,
      options: [null, ...Power],
      advanced: true,
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
