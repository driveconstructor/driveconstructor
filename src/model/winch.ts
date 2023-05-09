import icon from "../images/el-winch.svg";
import { SystemElement } from "./system";

export type Winch = {
  torque: number;
  ratedSpeed: number;
};

export const WinchElement: SystemElement<Winch> = {
  icon,
  params: {
    torque: {
      label: "Torque, kNm",
      type: "number",
      value: 100,
    },
    ratedSpeed: {
      label: "Rated speed, rpm",
      type: "number",
      value: 200,
    },
  },
};
