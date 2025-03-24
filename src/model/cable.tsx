import icon from "../images/el-cable.svg";
import { SystemElement } from "./system";

export const Material = ["copper", "aluminum"] as const;
export const CrossSection = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 150, 185, 240, 300, 400, 500, 630,
  800,
] as const satisfies number[];

export const NumberOfRuns = [1, 2, 4, 6, 8] as const;

export type MaterialType = (typeof Material)[number];

export type CrossSectionType = (typeof CrossSection)[number];

export type NumberOfRunsType = (typeof NumberOfRuns)[number];

export type Cable = {
  length: number;
  material: MaterialType;
  crossSection: CrossSectionType | null;
  numberOfRuns: NumberOfRunsType | null;
};

export const LengthParam = {
  length: {
    label: "Length (m)",
  },
};

export const NumberOfRunsParam = {
  numberOfRuns: {
    label: "Number of runs",
  },
};

export const MaterialParam = {
  material: {
    label: "Conductor material",
  },
};

export const CrossSectionParam = {
  crossSection: {
    label: "Cross-section of phase conductor (mm2)",
  },
};

export const CableElement: SystemElement<Cable> = {
  icon,
  params: {
    length: {
      ...LengthParam.length,
      type: "number",
      range: {
        min: 0,
        max: 5000,
      },
      value: 30,
    },
    numberOfRuns: {
      ...NumberOfRunsParam.numberOfRuns,
      type: "number",
      options: [null, ...NumberOfRuns],
      optionLabels: ["auto", ...NumberOfRuns],
      value: null,
    },
    crossSection: {
      ...CrossSectionParam.crossSection,
      type: "number",
      value: null,
      options: [null, ...CrossSection],
      optionLabels: ["auto", ...CrossSection],
    },
    material: {
      ...MaterialParam.material,
      type: "text",
      options: [...Material],
      value: "copper",
    },
  },
};
