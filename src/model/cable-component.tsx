import {
  Cable,
  CrossSectionParam,
  MaterialParam,
  NumberOfRunsParam,
} from "./cable";
import { ComponentModel } from "./component";
import { DesignationParam, LengthParam, PriceParam } from "./component-params";
import { EfficiencyParam } from "./efficiency-component";

export type CableComponent = Cable & {
  voltage: number;
  reactancePerHz: number;
  resistancePerMeter: number;
  pricePerMeter: number;
  price: number;
  designation: string;
  voltageDrop: number;
  losses: number;
  efficiency100: number;
  weight?: number;
  footprint?: number;
  volume?: number;
  efficiency75?: number;
  efficiency50?: number;
  efficiency25?: number;
};

export const CableComponentModel: ComponentModel<CableComponent> = {
  kind: "cable",
  title: "Cable",
  params: {
    ...LengthParam,
    ...PriceParam,
    ...NumberOfRunsParam,
    ...CrossSectionParam,
    ...MaterialParam,
    voltage: {
      label: "Voltage rating (kV)",
    },
    reactancePerHz: {
      label: "Reactance (PerHz)",
      precision: 6,
    },
    resistancePerMeter: {
      label: "Resistance per meter",
      precision: 8,
    },
    pricePerMeter: {
      label: "Price per meter",
      precision: 2,
    },
    ...DesignationParam,
    voltageDrop: {
      label: "Voltage drop",
      precision: 2,
    },
    losses: {
      label: "Losses, kW",
      precision: 2,
    },
    ...EfficiencyParam,
  },
};
