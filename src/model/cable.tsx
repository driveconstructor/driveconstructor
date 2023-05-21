import icon from "../images/el-cable.svg";
import { SystemElement } from "./system";

const Material = ["copper", "aluminum"] as const;
const CrossSection = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 150, 185, 240, 300, 400, 500, 630,
  800,
] as const;
const NumberOfRuns = [1, 2, 4, 6, 8];

export type Cable = {
  length: number;
  material: (typeof Material)[number];
  crossSection: (typeof CrossSection)[number] | null;
  numberOfRuns: (typeof NumberOfRuns)[number] | null;
};

export const CableElement: SystemElement<Cable> = {
  icon,
  params: {
    length: {
      label: "Length (m)",
      type: "number",
      range: {
        min: 0,
        max: 5000,
      },
      value: 30,
    },
    numberOfRuns: {
      label: "Number of runs",
      type: "number",
      options: [null, ...NumberOfRuns],
      optionLabels: ["auto", ...NumberOfRuns],
      value: null,
    },
    crossSection: {
      label: "Cross-section of phase conductor (mm2)",
      type: "number",
      value: null,
      options: [null, ...CrossSection],
      optionLabels: ["auto", ...CrossSection],
    },
    material: {
      label: "Conductor material",
      type: "text",
      options: [...Material],
      value: "copper",
    },
  },
};
