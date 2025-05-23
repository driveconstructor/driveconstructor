import icon from "../images/el-grid.svg";
import { SystemElement } from "./system";

export type Grid = {
  voltage: number;
  frequency: number;
  shortCircuitPower: number;
};

export const GridElement: SystemElement<Grid> = {
  icon,
  params: {
    voltage: {
      label: "Voltage (V)",
      type: "number",
      range: {
        min: 380,
        max: 11000,
      },
      value: 400,
    },
    frequency: {
      label: "Frequency (Hz)",
      type: "number",
      options: [50, 60],
      value: 50,
    },
    shortCircuitPower: {
      label: "Short-circuit power (MVA)",
      type: "number",
      range: {
        min: 100,
        max: 1000,
      },
      value: 200,
    },
  },
};
