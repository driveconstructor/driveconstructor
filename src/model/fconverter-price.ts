import { FcProtectionType } from "./cooling-protection";
import { FConverterMountingType, FConverterTypeAlias } from "./fconverter";

function getK1(type: FConverterTypeAlias) {
  if (type.includes("2Q")) {
    return 1.0;
  } else if (type.includes("4Q")) {
    return 1.3;
  }

  throw new Error("Invalid type");
}

function getK2(type: FConverterTypeAlias) {
  switch (type) {
    case "2Q-2L-VSC-6p":
      return 1.0;
    case "2Q-2L-VSC-12p":
      return 1.1;
    default:
      return 1;
  }
}

function getK3(
  protection: FcProtectionType,
  ratedPowerLO: number,
  cosFi100: number,
  efficiency100: number,
) {
  switch (protection) {
    case "IP21/31":
      return 1.0;
    case "IP54/55":
      return (
        1.1 - (((0.02 * ratedPowerLO) / cosFi100 / efficiency100) * 100) / 1000
      );
  }
}

function getK4(protection: FcProtectionType) {
  switch (protection) {
    case "IP21/31":
      return 1.0;
    case "IP54/55":
      return 1.02;
  }
}

function getK4a(mounting: FConverterMountingType) {
  switch (mounting) {
    case "wall":
      return 1.0;
    case "floor":
      return 1.2;
  }
}

export function getPrice(
  type: FConverterTypeAlias,
  mounting: FConverterMountingType,
  protection: FcProtectionType,
  cosFi100: number,
  efficiency100: number,
  ratedPowerLO: number,
) {
  const K1 = getK1(type);
  const K2 = getK2(type);
  const K3 = getK3(protection, ratedPowerLO, cosFi100, efficiency100);

  if (type.includes("2L")) {
    return (
      K1 *
      K2 *
      K3 *
      getK4a(mounting) *
      90 *
      Math.pow((ratedPowerLO / cosFi100 / efficiency100) * 100, 1 - 0.1)
    );
  }

  const K4 = getK4(protection);

  if (type.includes("SCHB")) {
    return (
      K1 *
      K4 *
      2000 *
      Math.pow((ratedPowerLO / cosFi100 / efficiency100) * 100, 1 - 0.43)
    );
  } else if (type.includes("NPC")) {
    return (
      K1 *
      K4 *
      12000 *
      Math.pow((ratedPowerLO / cosFi100 / efficiency100) * 100, 1 - 0.61)
    );
  }

  throw new Error("Invalid type");
}
