import { SystemParam } from "./system";

export const EMachineProtection = ["IP21/23", "IP54/55"] as const;
export const FcProtection = ["IP21/31", "IP54/55"] as const;
export const FcCooling = ["air", "water"] as const;
export type EMachineProtectionType = (typeof EMachineProtection)[number];

export type FcCoolingType = (typeof FcCooling)[number];

export type FcProtectionType = (typeof FcProtection)[number];

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

export const FcCoolingModel: Record<"cooling", SystemParam<any>> = {
  cooling: {
    ...CoolingParam.cooling,
    type: "text",
    options: [...FcCooling],
    value: "air",
    advanced: true,
  },
};

export const FcProtectionModel: Record<"protection", SystemParam<any>> = {
  protection: {
    ...ProtectionParam.protection,
    type: "text",
    options: [...FcProtection],
    value: "IP21/31",
    advanced: true,
  },
};

export const EMachineProtectionModel: Record<"protection", SystemParam<any>> = {
  protection: {
    ...ProtectionParam.protection,
    type: "text",
    options: [...EMachineProtection],
    value: "IP21/23",
    advanced: true,
  },
};
