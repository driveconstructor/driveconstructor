import icon from "../images/el-pump.svg";
import { SystemElement } from "./system";

const PumpType = ["centrifugal", "positive displacement"] as const;

export type Pump = {
  type: (typeof PumpType)[number];
  ratedSpeed: number;
};

export const PumpElement: SystemElement<Pump> = {
  icon,
  params: {
    type: {
      type: "text",
      value: "centrifugal",
      options: PumpType,
    },
    ratedSpeed: {
      type: "number",
      value: 10,
    },
  },
};
