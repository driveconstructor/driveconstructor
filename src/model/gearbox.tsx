import icon from "../images/el-gearbox.svg";
import { SystemElement, SystemParam } from "./system";

export const StageType = ["worm", "helical", "planetary", "bevel"] as const;
type StageTypeAlias = (typeof StageType)[number];

export const SecondaryStageType: StageTypeAlias[] = ["helical", "planetary"];

export const NumberOfStages = [1, 2, 3] as const;

const GearRatiosByType = {
  worm: {
    min: 10,
    max: 40,
    value: 10,
  },
  helical: {
    min: 3,
    max: 8,
    value: 5,
  },
  planetary: {
    min: 4,
    max: 8,
    value: 5,
  },
  bevel: {
    min: 2,
    max: 3,
    value: 2,
  },
};

export type Gearbox = {
  numberOfStages: (typeof NumberOfStages)[number];

  stage1Type: StageTypeAlias;
  stage1Ratio: number;
  stage2Type: StageTypeAlias;
  stage2Ratio: number;
  stage3Type: StageTypeAlias;
  stage3Ratio: number;
};

function StageTypeParam(
  i: number,
  options: readonly StageTypeAlias[]
): SystemParam<StageTypeAlias> {
  return {
    type: "text",
    label: `Stage ${i} type`,
    options: [...options],
    value: "helical",
  };
}

function StageRatioParam(i: number): SystemParam<number> {
  return {
    type: "number",
    label: `Stage ${i} ratio`,
    value: 3,
    range: {
      min: 1.5,
      max: 100,
      step: 0.5,
    },
  };
}

export const GearboxElement: SystemElement<Gearbox> = {
  icon,
  params: {
    numberOfStages: {
      type: "number",
      label: "Number of stages",
      value: 1,
      options: [...NumberOfStages],
    },
    stage1Type: StageTypeParam(1, StageType),
    stage1Ratio: StageRatioParam(1),
    stage2Type: StageTypeParam(2, SecondaryStageType),
    stage2Ratio: StageRatioParam(2),
    stage3Type: StageTypeParam(3, SecondaryStageType),
    stage3Ratio: StageRatioParam(3),
  },
  customize(model, value) {
    if (value.stage1Type == "worm") {
      return {
        ...model,
        params: {
          ...model.params,
          numberOfStages: { ...model.params.numberOfStages, options: [1] },
          stage2Ratio: { ...model.params.stage2Ratio, hidden: true },
          stage2Type: { ...model.params.stage2Type, hidden: true },
          stage3Ratio: { ...model.params.stage3Ratio, hidden: true },
          stage3Type: { ...model.params.stage3Type, hidden: true },
        },
      };
    }

    switch (value.numberOfStages) {
      case 1:
        return {
          ...model,
          params: {
            ...model.params,
            stage2Ratio: { ...model.params.stage2Ratio, hidden: true },
            stage2Type: { ...model.params.stage2Type, hidden: true },
            stage3Ratio: { ...model.params.stage3Ratio, hidden: true },
            stage3Type: { ...model.params.stage3Type, hidden: true },
          },
        };
      case 2:
        return {
          ...model,
          params: {
            ...model.params,
            stage3Ratio: { ...model.params.stage3Ratio, hidden: true },
            stage3Type: { ...model.params.stage3Type, hidden: true },
          },
        };
    }

    return model;
  },
};
