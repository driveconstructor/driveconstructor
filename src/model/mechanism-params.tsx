import { SystemParam } from "./system";

export const PowerOnShaftParam: Omit<SystemParam, "value"> = {
  label: "Power on shaft, kW",
  type: "number",
  precision: 1,
};

export const MinimalSpeedParam: Omit<SystemParam, "value"> = {
  label: "Minimal speed, rpm",
  type: "number",
};
