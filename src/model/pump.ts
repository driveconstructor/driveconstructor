import icon from "../images/el-pump.svg";
import { SystemElement } from "./system";

const PumpType = ["centrifugal", "positive displacement"] as const;

export type Pump = {
  type: (typeof PumpType)[number];
  head: number;
  ratedSpeed: number;
};

export const PumpElement: SystemElement<Pump> = {
  icon,
  params: {
    type: {
      label: "Type",
      type: "text",
      value: "centrifugal",
      options: PumpType,
    },
    head: {
      label: "Head, m",
      type: "number",
      range: {
        min: 0,
        max: 1000,
      },
      value: 200,
    },
    ratedSpeed: {
      label: "Rated speed, rpm",
      type: "number",
      value: 10,
    },
  },
};
