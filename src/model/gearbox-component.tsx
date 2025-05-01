import { ComponentModel } from "./component";
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
      label: "Input rated torque (KNm)",
      precision: 2,
    },
    torque: {
      label: "Output rated torque (KNm)",
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
    efficiency100: {
      label: "Efficiency",
      precision: 2,
    },
    efficiency75: {
      label: "Efficiency @ 75%",
    },
    efficiency50: {
      label: "Efficiency @ 50%",
    },
    efficiency25: {
      label: "Efficiency @ 25%",
    },
    weight: {
      label: "Weight",
      precision: 2,
    },
    length: {
      label: "Length",
      precision: 2,
    },
    height: {
      label: "Height",
      precision: 2,
    },
    width: {
      label: "Width",
      precision: 2,
    },
    price: {
      label: "Price",
      precision: 2,
    },
    designation: {
      label: "Designation",
    },
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
