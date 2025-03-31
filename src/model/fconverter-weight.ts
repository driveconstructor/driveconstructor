import { FcCoolingType, FcProtectionType } from "./cooling-protection";
import { FConverterTypeAlias } from "./fconverter";

function getK1(cooling: FcCoolingType) {
  switch (cooling) {
    case "air":
      return 1;
    case "water":
      return 0.7;
  }
}

function getK2(type: FConverterTypeAlias) {
  if (type.includes("4Q")) {
    return type.includes("2L") ? 1.8 : 1.4;
  } else if (type.includes("2Q")) {
    return 1;
  }

  throw new Error("Invalid type");
}

function getK3(type: FConverterTypeAlias, protection: FcProtectionType) {
  switch (protection) {
    case "IP21/31":
      return 1.0;
    case "IP54/55":
      return type.includes("2L") ? 1.025 : 1.01;
  }
}

export function getWeight(
  type: FConverterTypeAlias,
  cooling: FcCoolingType,
  protection: FcProtectionType,
  cosFi100: number,
  efficiency100: number,
  ratedVoltage: number,
  ratedPowerLO: number,
) {
  const K1 = getK1(cooling);
  const K2 = getK2(type);
  const K3 = getK3(type, protection);

  if (type.includes("2L")) {
    if (ratedPowerLO < 250) {
      const K4 = 1 + (0.05 * (ratedVoltage - 400)) / (690 - 400);
      return (
        ((K1 * K2 * K3 * K4 * 0.5 * ratedPowerLO) / cosFi100 / efficiency100) *
        100
      );
    } else {
      const K4 = 1 + (0.15 * (ratedVoltage - 400)) / (690 - 400);
      return (
        K1 *
        K2 *
        K3 *
        K4 *
        3 *
        Math.pow((ratedPowerLO / cosFi100 / efficiency100) * 100, 0.8)
      );
    }
  }

  let K4;
  let K5;
  if (type.includes("SCHB")) {
    K4 = 1.0 + (ratedVoltage / 1000 - 3) / 5;
    K5 = 1.2 - (ratedVoltage / 1000 - 3) / 14;
  } else if (type.includes("NPC")) {
    K4 = 1.5 + (ratedVoltage / 1000 - 3) / 5;
    K5 = 0.5 - (ratedVoltage / 1000 - 3) / 14;
  } else {
    throw new Error("Invalid type");
  }

  return (
    K1 * K2 * K3 * (K4 + K5 * ((ratedPowerLO / cosFi100 / efficiency100) * 100))
  );
}
