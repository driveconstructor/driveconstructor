import { Cable } from "./cable";
import { ComponentModel } from "./component";

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
    length: {
      label: "Length (m)",
    },
    price: {
      label: "Price",
    },
    numberOfRuns: {
      label: "Number of runs",
    },
    crossSection: {
      label: "Cross-section of phase conductor (mm2)",
    },
    material: {
      label: "Conductor material",
    },
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
    designation: {
      label: "Designation",
    },
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
