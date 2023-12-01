import icon from "../images/el-gearbox.svg";
import { System, SystemElement, SystemParam } from "./system";

export const StageType = ["worm", "helical", "planetary", "bevel"] as const;
type StageTypeAlias = (typeof StageType)[number];

export const SecondaryStageType: StageTypeAlias[] = ["helical", "planetary"];

export const NumberOfStages = [1, 2, 3] as const;

export type Gearbox = {
  numberOfStages: (typeof NumberOfStages)[number];

  stage1Type: StageTypeAlias;
  stage1Ratio: number;

  stage2Type: StageTypeAlias;
  stage2Ratio: number;

  stage3Type: StageTypeAlias;
  stage3Ratio: number;
};

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

function StageParams(
  i: number,
  type: StageTypeAlias,
  options: readonly StageTypeAlias[],
  hidden: boolean,
): [SystemParam<StageTypeAlias>, SystemParam<number>] {
  return [
    {
      type: "text",
      label: `Stage ${i} type`,
      options: [...options],
      value: type,
      hidden,
      postUpdate: (system, value) => {
        const result = {
          ...system,
          input: {
            ...system.input,
            gearbox: {
              ...system.input.gearbox,
              [`stage${i}Ratio`]: GearRatiosByType[value].value,
            },
          },
        } as System;
        return result;
      },
    },
    {
      type: "number",
      label: `Stage ${i} ratio`,
      value: GearRatiosByType[type].value,
      range: {
        min: GearRatiosByType[type].min,
        max: GearRatiosByType[type].max,
        step: 0.5,
      },
      hidden,
    },
  ];
}

function GearboxElementParams(numberOfStages: number, type: StageTypeAlias[]) {
  const [stage1Type, stage1Ratio] = StageParams(1, type[0], StageType, false);
  const [stage2Type, stage2Ratio] = StageParams(
    2,
    type[1],
    SecondaryStageType,
    numberOfStages <= 1,
  );
  const [stage3Type, stage3Ratio] = StageParams(
    3,
    type[2],
    SecondaryStageType,
    numberOfStages <= 2,
  );

  return {
    stage1Type,
    stage1Ratio,
    stage2Type,
    stage2Ratio,
    stage3Type,
    stage3Ratio,
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
    ...GearboxElementParams(1, ["helical", "helical", "helical"]),
  },
  customize: (model, value) => {
    return {
      ...model,
      params: {
        ...model.params,
        ...GearboxElementParams(value.numberOfStages, [
          value.stage1Type,
          value.stage2Type,
          value.stage3Type,
        ]),
      },
    };
  },
};
