import icon from "../images/el-emachine.svg";
import { SystemElement } from "./system";

const EMachineType = ["SCIM", /*'DFIM',*/ "PMSM", "SyRM"] as const;
const ERatedPower = [
  1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110,
  132, 160, 200, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900,
  1000, 1250, 1400, 1600, 2000, 2500, 3150, 4000, 5000,
];

export type EMachine = {
  type: (typeof EMachineType)[number] | null;
  speed: number;
  ratedPower: number | null;
};

export const EMachineElement: SystemElement<EMachine> = {
  icon,
  params: {
    type: {
      label: "Type",
      type: "text",
      value: null,
      options: [null, ...EMachineType],
    },
    speed: {
      label: "Rated power, kW",
      type: "number",
      value: 300,
    },
    ratedPower: {
      label: "Rated synchronous speed, rpm",
      type: "number",
      value: 400,
      options: [null, ...ERatedPower],
    },
  },
};
