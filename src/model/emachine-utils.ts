import { EMachineComponent } from "./emachine-component";
import { TypeSpeedTorque } from "./emachine-sizing";
import { LowVoltage, MediumVoltage, Voltage, VoltageY } from "./voltage";

export function emachinDesignation(
  typeSpeedTorque: TypeSpeedTorque,
  ratedVoltageY: VoltageY,
  shaftHeight: number,
  cooling: string,
  protection: string,
  frameMaterial: string,
  mounting: string,
  efficiencyClass: string,
) {
  const result: string[] = [];
  switch (typeSpeedTorque.type) {
    case "SCIM":
      result.push("IM");
      break;
    case "PMSM":
      result.push("PM");
      break;
    case "SyRM":
      result.push("SR");
      break;
    default:
      result.push("XXX");
  }

  result.push(typeSpeedTorque.ratedPower.toFixed(0));
  result.push(ratedVoltageY.type);

  result.push(ratedVoltageY.value.toFixed(0));
  result.push("SH" + shaftHeight);

  switch (cooling) {
    case "IC411":
      result.push("ACS");
      break;
    case "IC416":
      result.push("ACF");
      break;
    case "IC71W":
      result.push("WC");
      break;
    default:
      result.push("XXX");
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

  switch (frameMaterial) {
    case "cast iron":
      result.push("CI");
      break;
    case "steel":
      result.push("ST");
      break;
    case "aluminum":
      result.push("AL");
      break;
    default:
      result.push("XXX");
  }

  result.push(typeSpeedTorque.ratedSynchSpeed.toFixed(0));
  result.push(mounting);
  result.push(efficiencyClass);
  return result.join("-");
}
