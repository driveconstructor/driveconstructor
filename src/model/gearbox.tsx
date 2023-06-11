import icon from "../images/el-gearbox.svg";
import { SystemElement } from "./system";

export const StageType = ["worm", "helical", "planetary", "bevel"] as const;
export const SecondaryStageType = ["helical", "planetary"] as const;

export const NumberOfStages = [1, 2, 3] as const;

export type Gearbox = {
  numberOfStages: (typeof NumberOfStages)[number];

  stage1Type: (typeof StageType)[number];
  stage1Ratio: number;
  /*stage2Type: (typeof StageType)[number] | null;
  stage2Ratio: number | null;
  stage3Type: (typeof StageType)[number] | null;
  stage3Ratio: number | null;*/
};

export const GearboxElement: SystemElement<Gearbox> = {
  icon,
  params: {
    numberOfStages: {
      type: "text",
      label: "Number of stages",
      value: 1,
      options: [...NumberOfStages],
    },
    stage1Type: {
      label: "Stage 1 type",
      type: "text",
      options: [...StageType],
      value: "worm",
    },
    stage1Ratio: {
      type: "number",
      label: "Stage 1 ratio",
      value: 10,
    },
  },
};

/*export function gearboxConstructor(isRequired, withDefault) {
  return {
    numberOfStages: {
      type: Number,
      enum: NumberOfStages,
      ui: {
        label: 'Number of stages',
        hideIfEmpty: true,
        help: 'Choose number of stages your gearbox consists of',
        url: '/docs/TextBook/System_components/Gearboxes.html',
        order: 3
      },
      default: withDefault ? 1 : undefined,
      required: isRequired,
    },
    stage1Type: {
      type: String,
      enum: StageType,
      ui: {
        label: 'Stage 1 type',
        hideIfEmpty: true,
        help: 'Stages may be of different types combined together',
        url: '/docs/TextBook/System_components/Stages.html',
        order: 4
      },
      default: withDefault ? 'helical' : undefined,
      required: isRequired
    },
    stage1Ratio: {
      type: Number,
      ui: {
        label: 'Stage 1 ratio',
        hideIfEmpty: true,
        step: 0.5,
        order: 5
      },
      min: 1.5,
      max: 100,
      default: withDefault ? 3 : undefined,
    },
    stage2Type: {
      type: String,
      enum: SecondaryStageType,
      ui: {
        label: 'Stage 2 type',
        hideIfEmpty: true,
        order: 6
      },
      default: withDefault ? 'helical' : undefined,
      required: isRequired
    },
    stage2Ratio: {
      type: Number,
      ui: {
        label: 'Stage 2 ratio',
        hideIfEmpty: true,
        step: 0.5,
        order: 7
      },
      min: 1.5,
      max: 100,
      default: withDefault ? 3 : undefined,
    },
    stage3Type: {
      type: String,
      enum: SecondaryStageType,
      ui: {
        label: 'Stage 3 type',
        hideIfEmpty: true,
        order: 8
      },
      default: withDefault ? 'helical' : undefined,
      required: isRequired
    },
    stage3Ratio: {
      type: Number,
      ui: {
        label: 'Stage 3 ratio',
        hideIfEmpty: true,
        step: 0.5,
        order: 9
      },
      min: 1.5,
      max: 100,
      default: withDefault ? 3 : undefined,
    }
  }
}*/
