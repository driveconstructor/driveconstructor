import { ComponentModel } from "./component";
import {
  DesignationParam,
  HeightParam,
  LengthParam,
  PriceParam,
  WeightParam,
  WidthParam,
} from "./component-params";
import { EfficiencyXXXParams } from "./efficiency-component";
import { Gearbox } from "./gearbox";

export type GearboxStageComponent = {
  inputTorque: number;
  torque: number;
  gearRatio: number;
  efficiency100: number;
  weight: number;
  length: number;
  height: number;
  width: number;
  price: number;
  inertiaHSpart?: number;
  inertiaLSpart?: number;
};

export type GearboxComponent = Gearbox &
  GearboxStageComponent & {
    designation: string;
    efficiency75: number;
    efficiency50: number;
    efficiency25: number;
    volume: number;
    footprint: number;
  };

export const GearboxComponentModel: ComponentModel<GearboxComponent> = {
  kind: "gearbox",
  title: "Gearbox",
  customize: (model, component) => {
    return {
      ...model,
      params: {
        ...model.params,
        stage2Ratio: {
          ...model.params.stage2Ratio,
          hidden: component.numberOfStages == 1,
        },
        stage2Type: {
          ...model.params.stage2Type,
          hidden: component.numberOfStages == 1,
        },
        stage3Ratio: {
          ...model.params.stage3Ratio,
          hidden: component.numberOfStages <= 2,
        },
        stage3Type: {
          ...model.params.stage3Type,
          hidden: component.numberOfStages <= 2,
        },
      },
    };
  },
  params: {
    inputTorque: {
      label: "Input rated torque, kNm",
      precision: 2,
    },
    torque: {
      label: "Output rated torque, kNm",
      precision: 2,
    },
    numberOfStages: {
      label: "Number of stages",
    },
    stage1Ratio: {
      label: `Stage 1 ratio`,
      precision: 2,
    },
    stage2Ratio: {
      label: `Stage 2 ratio`,
      precision: 2,
    },
    stage3Ratio: {
      label: `Stage 3 ratio`,
      precision: 2,
    },
    stage1Type: {
      label: `Stage 1 type`,
    },
    stage2Type: {
      label: `Stage 2 type`,
    },
    stage3Type: {
      label: `Stage 3 type`,
    },
    gearRatio: {
      label: "Gear ratio",
      precision: 2,
    },
    ...EfficiencyXXXParams,
    ...WeightParam,
    ...LengthParam,
    ...HeightParam,
    ...WidthParam,
    ...PriceParam,
    ...DesignationParam,
    volume: {
      label: null,
      hidden: true,
    },
    footprint: {
      label: null,
      hidden: true,
    },
  },
};
