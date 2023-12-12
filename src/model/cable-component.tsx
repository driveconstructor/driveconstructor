import {
  Cable,
  CrossSectionParam,
  LengthParam,
  MaterialParam,
  NumberOfRunsParam,
} from "./cable";
import { ComponentModel } from "./component";
import { DesignationParam, PriceParam } from "./component-params";

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
    },
    resistancePerMeter: {
      label: "Resistance per meter",
    },
    pricePerMeter: {
      label: "Price per meter",
    },
    ...DesignationParam,
    voltageDrop: {
      label: "Voltage drop",
    },
    losses: {
      label: "Losses, kW",
    },
    efficiency100: {
      label: "Efficiency, %",
    },
  },
};
