import { Gearbox } from "./gearbox";

export type GearboxStageComponent = {
  designation: string;
  efficiency100: number;
  weight: number;
  length: number;
  height: number;
  width: number;
  price: number;
  inertiaHSpart: number;
  inertiaLSpart: number;
};

export type GearboxComponent = Gearbox & GearboxStageComponent;
