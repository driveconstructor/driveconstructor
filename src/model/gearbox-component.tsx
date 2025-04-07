import { ComponentModel } from "./component";
import { Gearbox } from "./gearbox";

export type GearboxStageComponent = {
  torque: number;
  gearRatio: number;
  efficiency100: number;
  weight: number;
  length: number;
  height: number;
  width: number;
  price: number;
  designation?: string;
  inertiaHSpart?: number;
  inertiaLSpart?: number;
};

export type GearboxComponent = Gearbox &
  GearboxStageComponent & {
    inputTorque: number;
    designation: string;
  };

export const GearboxComponentModel: ComponentModel<GearboxComponent> = {
  kind: "gearbox",
  title: "Gearbox",
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
      label: "Gear ration",
      precision: 2,
    },
    efficiency100: {
      label: "Efficiency",
      precision: 4,
    },
    weight: {
      label: "Weight",
      precision: 2,
    },
    length: {
      label: "Lenght",
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
  },
};
