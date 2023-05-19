import { SystemParam } from "./system";

type EnironmentParam = "altitude" | "ambientTemperature" | "coolantTemperature";

export const EnvironmentModel: Record<EnironmentParam, SystemParam<number>> = {
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
