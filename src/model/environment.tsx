import { SystemParam } from "./system";

export type Environment = {
  altitude: number;
  ambientTemperature: number;
  coolantTemperature: number;
};

export const EnvironmentModel: Record<keyof Environment, SystemParam<any>> = {
  altitude: {
    label: "Altitude, m",
    type: "number",
    range: {
      min: 0,
      max: 5000,
    },
    value: 1000,
    advanced: true,
  },
  ambientTemperature: {
    label: "Ambient temperature, d.C.",
    type: "number",
    range: {
      min: 0,
      max: 60,
    },
    value: 30,
    advanced: true,
  },
  coolantTemperature: {
    label: "Coolant temperature, d.C.",
    type: "number",
    range: {
      min: 0,
      max: 50,
    },
    value: 30,
    advanced: true,
  },
};
