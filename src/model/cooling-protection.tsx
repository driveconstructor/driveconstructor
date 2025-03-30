import { SystemParam } from "./system";

export const Protection = ["IP21/31", "IP54/55"] as const;
export const Cooling = ["air", "water"] as const;

export type FcCoolingType = (typeof Cooling)[number];

export type FcProtectionType = (typeof Protection)[number];

export type CoolingProtection = {
  cooling: FcCoolingType;
  protection: FcProtectionType;
};

export const ProtectionParam = {
  protection: {
    label: "Protection",
  },
};

export const CoolingParam = {
  cooling: {
    label: "Cooling",
  },
};

export const CoolingProtectionModel: Record<
  keyof CoolingProtection,
  SystemParam<any>
> = {
  protection: {
    ...ProtectionParam.protection,
    type: "text",
    options: [...Protection],
    value: "IP21/31",
    advanced: true,
  },
  cooling: {
    ...CoolingParam.cooling,
    type: "text",
    options: [...Cooling],
    value: "air",
    advanced: true,
  },
};
