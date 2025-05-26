import {
  FootprintParam,
  PriceParam,
  VolumeParam,
  WeightParam,
} from "./component-params";
import { EfficiencyXXXParams } from "./efficiency-component";

export type SystemParamsType = {
  price: number;
  efficiency100: number;
  efficiency75: number;
  efficiency50: number;
  efficiency25: number;
  volume: number;
  footprint: number;
  weight: number;
  thdU: number | null;
  thdI: number | null;
};

export type SystemParamModelType = {
  label: React.ReactNode;
  precision?: number;
  max?: number;
  min?: number;
  comparison?: boolean;
};

export const SystemParamsModel: Record<
  keyof SystemParamsType,
  SystemParamModelType
> = {
  ...PriceParam,
  efficiency100: {
    ...EfficiencyXXXParams.efficiency100,
    max: 100,
    min: 75,
  },
  efficiency75: {
    ...EfficiencyXXXParams.efficiency75,
    max: 100,
    min: 75,
  },
  efficiency50: {
    ...EfficiencyXXXParams.efficiency50,
    max: 100,
    min: 75,
  },
  efficiency25: {
    ...EfficiencyXXXParams.efficiency25,
    max: 100,
    min: 75,
  },
  ...VolumeParam,
  ...FootprintParam,
  ...WeightParam,
  thdU: {
    label: "THD(u), %",
  },
  thdI: {
    label: "THD(i), %",
  },
};

export function getSystemParamModel(key: string): SystemParamModelType {
  return (SystemParamsModel as any)[key];
}
