import { FcCoolingType, FcProtectionType } from "./cooling-protection";
import { FConverterMountingType, FConverterTypeAlias } from "./fconverter";
import { FcVoltageY } from "./fconverter-voltage";

export function getDesignation(
  type: FConverterTypeAlias,
  voltage: FcVoltageY,
  ratedPowerLO: number,
  protection: FcProtectionType,
  cooling: FcCoolingType,
  mounting: FConverterMountingType,
) {
  const result = [];
  if (type.includes("4Q")) {
    result.push("4Q");
  } else if (type.includes("2Q")) {
    result.push("2Q");
  } else {
    result.push("XXX");
  }

  if (type.includes("2L")) {
    result.push("2L");
  } else if (type.includes("3L-NPC")) {
    result.push("NPC");
  } else if (type.includes("SCHB")) {
    result.push("SCHB");
  } else {
    result.push("XXX");
  }

  if (voltage.type == "LV") {
    result.push(voltage.value);
  } else {
    const number = parseFloat((voltage.value / 1000).toFixed(2));
    result.push(number + "k");
  }

  result.push(ratedPowerLO);

  switch (protection) {
    case "IP54/55":
      result.push("IP5x");
      break;
    case "IP21/31":
      result.push("IP2x");
      break;
    default:
      result.push("XXX");
  }

  switch (cooling) {
    case "air":
      result.push("AC");
      break;
    case "water":
      result.push("WC");
      break;
    default:
      result.push("XXX");
  }

  switch (mounting) {
    case "wall":
      result.push("W");
      break;
    case "floor":
      result.push("F");
      break;
    default:
      result.push("XXX");
  }

  if (type.endsWith("-6p")) {
    result.push("6p");
  } else if (type.endsWith("-12p")) {
    result.push("12p");
  }
  return result.join("-");
}
