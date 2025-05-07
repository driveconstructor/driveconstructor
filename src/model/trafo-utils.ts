import { EMachineProtectionType, FcCoolingType } from "./cooling-protection";
import { TypeIIAlias, TypeIIIAlias, TypeIVAlias } from "./trafo";

function getA(protection: EMachineProtectionType) {
  switch (protection) {
    case "IP21/23":
      return 1.0;
    case "IP54/55":
      return 1.05;
  }
}

function getB(typeIV: TypeIVAlias) {
  switch (typeIV) {
    case "stand-alone":
      return 1.0;
    case "integrated":
      return 0.75;
  }
}

function getC(typeIII: TypeIIIAlias) {
  switch (typeIII) {
    case "2-winding":
      return 1.0;
    case "3-winding":
      return 1.05;
    case "multi-winding":
      return 1.1;
  }
}

function getD(cooling: FcCoolingType) {
  switch (cooling) {
    case "air":
      return 1.0;
    case "water":
      return 0.8;
  }
}

export function getWeight(
  protection: EMachineProtectionType,
  typeIV: TypeIVAlias,
  typeIII: TypeIIIAlias,
  cooling: FcCoolingType,
  voltageHVmax: number,
  ratedPower: number,
) {
  const A = getA(protection);
  const B = getB(typeIV);
  const C = getC(typeIII);
  const D = getD(cooling);

  return (
    A *
    B *
    C *
    D *
    (2.5 + (0.03 * voltageHVmax) / 1000) *
    Math.pow(ratedPower / 1000, 0.75 - (0.01 * voltageHVmax) / 1000)
  );
}

export function getRatedCoolantTemperature(cooling: FcCoolingType) {
  switch (cooling) {
    case "air":
      return 0;
    case "water":
      return 40;
  }
}

export function getDesignation(
  protection: EMachineProtectionType,
  typeIV: TypeIVAlias,
  typeII: TypeIIAlias,
  cooling: FcCoolingType,
  voltageHVmax: number,
  ratedPower: number,
) {
  const result = [];

  switch (typeII) {
    case "dry":
      result.push("D");
      break;
    case "oil-immersed":
      result.push("O");
      break;
    default:
      result.push("XXX");
  }

  switch (typeIV) {
    case "integrated":
      result.push("I");
      break;
    case "stand-alone":
      result.push("S");
      break;
    default:
      result.push("XXX");
  }

  result.push(ratedPower.toFixed().padStart(5, "0"));
  result.push(voltageHVmax.toFixed().padStart(5, "0"));

  switch (cooling) {
    case "air":
      result.push("AC");
      break;
    case "water":
      result.push("WC");
      break;
  }

  switch (protection) {
    case "IP54/55":
      result.push("IP5x");
      break;
    case "IP21/23":
      result.push("IP2x");
      break;
    default:
      result.push("XXX");
  }

  return result.join("-");
}
