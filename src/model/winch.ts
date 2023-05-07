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
      type: "number",
      value: 100,
    },
    ratedSpeed: {
      type: "number",
      value: 200,
    },
  },
};
