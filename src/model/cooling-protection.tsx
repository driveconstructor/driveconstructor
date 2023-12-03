import { SystemParam } from "./system";

export const Protection = ["IP21/31", "IP54/55"] as const;
export const Cooling = ["air", "water"] as const;

export type CoolingProtection = {
  cooling: (typeof Protection)[number];
  protection: (typeof Cooling)[number];
};

export const CoolingProtectionModel: Record<
  keyof CoolingProtection,
  SystemParam<any>
> = {
  protection: {
    label: "Protection",
    type: "text",
    options: [...Protection],
    value: "IP21/31",
    advanced: true,
  },
  cooling: {
    label: "Cooling",
    type: "text",
    options: [...Cooling],
    value: "air",
    advanced: true,
  },
};
