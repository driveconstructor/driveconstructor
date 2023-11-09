import { Environment } from "./environment";
import { SystemElement } from "./system";
import icon from "../images/el-trafo.svg";

export const Power = [
  75, 93, 100, 112.5, 118, 145, 150, 160, 175, 190, 220, 225, 240, 250, 275,
  300, 315, 330, 400, 440, 500, 550, 630, 660, 750, 800, 1000, 1250, 1500, 1600,
  2000, 2500, 3150, 3750, 5000, 7500, 10000, 12000, 15000,
] as const;
export const Winding = ["2-winding", "3-winding", "multi-winding"];
export const Integration = ["stand-alone", "integrated"];
export const DryOil = ["dry", "oil-immersed"] as const;
export const Cooling = ["air", "water"];
export const Protection = ["IP21/23", "IP54/55"];

export type PowerTypeAlias = (typeof Power)[number];

export type Trafo = {
  ratedPower: PowerTypeAlias | null;
  //typeII: string;
  //typeIII: (typeof DryOil)[number];
}; // & Environment;

export const TrafoElement: SystemElement<Trafo> = {
  icon,
  params: {
    ratedPower: {
      label: "Rated power, kVA",
      type: "number",
      value: null,
      options: [null, ...Power],
    },
  },
};
