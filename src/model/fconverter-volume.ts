import { FcCoolingType, FcProtectionType } from "./cooling-protection";
import { FConverterTypeAlias } from "./fconverter";

function getK1(type: FConverterTypeAlias, cooling: FcCoolingType) {
  switch (cooling) {
    case "air":
      return 1;
    case "water":
      return type.includes("2L") ? 0.7 : 0.5;
  }
}

function getK2(type: FConverterTypeAlias) {
  if (type.includes("4Q")) {
    return type.includes("2L") ? 1.6 : 1.3;
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
      return type.includes("2L") ? 1.015 : 1.01;
  }
}

export function getVolume(
  type: FConverterTypeAlias,
  cooling: FcCoolingType,
  protection: FcProtectionType,
  cosFi100: number,
  efficiency100: number,
  ratedVoltage: number,
  ratedPowerLO: number,
) {
  const K1 = getK1(type, cooling);
  const K2 = getK2(type);
  const K3 = getK3(type, protection);

  if (type.includes("2L")) {
    const K4 = 1 + (0.15 * (ratedVoltage - 400)) / (690 - 400);
    if (ratedPowerLO < 250) {
      return (
        (((K1 * K2 * K3 * K4 * ratedPowerLO) / cosFi100 / efficiency100) *
          100) /
        1000
      );
    } else {
      return (
        K1 *
        K2 *
        K3 *
        K4 *
        0.01 *
        Math.pow((ratedPowerLO / cosFi100 / efficiency100) * 100, 0.75)
      );
    }
  }

  let K4;
  let K5;
  if (type.includes("SCHB")) {
    K4 = 5.5 + (ratedVoltage / 1000 - 3) * 0.75;
    K5 = 3.0 - (ratedVoltage / 1000 - 3) * 0.25;
  } else if (type.includes("NPC")) {
    K4 = 3 + (ratedVoltage / 1000 - 3) * 0.75;
    K5 = 1.5 - (ratedVoltage / 1000 - 3) * 0.25;
  } else {
    throw new Error("Invalid type");
  }

  return (
    K1 *
    K2 *
    K3 *
    (K4 + K5 * (((ratedPowerLO / cosFi100 / efficiency100) * 100) / 1000))
  );
}
