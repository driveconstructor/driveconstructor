import colors from "tailwindcss/colors";
import { EMachineComponent } from "./emachine-component";
import { TypeSpeedTorque } from "./emachine-sizing";
import { VoltageY } from "./voltage";
export function emachineDesignation(
  typeSpeedTorque: TypeSpeedTorque,
  ratedVoltageY: VoltageY,
  shaftHeight: number,
  cooling: string,
  protection: string,
  frameMaterial: string,
  mounting: string,
  efficiencyClass: string | null,
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
  result.push(efficiencyClass ? efficiencyClass : "any");
  return result.join("-");
}

export function emachineTypeFilter(em: EMachineComponent): boolean {
  switch (em.type) {
    case "SCIM": {
      if (
        em.ratedVoltageY.type == "LV" &&
        !em.efficiencyClass &&
        em.ratedPower <= 375
      ) {
        return false;
      }

      if (
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower > 375 &&
        em.efficiencyClass
      ) {
        return false;
      }

      if (em.ratedPower > 90 && em.frameMaterial == "aluminum") {
        return false;
      }

      if (
        em.ratedVoltageY.type == "MV" &&
        (em.efficiencyClass || em.frameMaterial == "aluminum")
      ) {
        return false;
      }

      if (
        em.ratedSynchSpeed >= 1000 &&
        em.ratedSynchSpeed <= 3000 &&
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower >= 1.1 &&
        em.ratedPower <= 2000
      ) {
        return true;
      }

      if (
        em.ratedVoltageY.type == "MV" &&
        em.ratedPower >= 200 &&
        em.ratedPower <= 5000
      ) {
        return true;
      }

      if (
        em.ratedSynchSpeed == 750 &&
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower >= 1.1 &&
        em.ratedPower <= 1000
      ) {
        return true;
      }

      if (
        em.ratedSynchSpeed == 600 &&
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower >= 1.1 &&
        em.ratedPower <= 500
      ) {
        return true;
      }

      if (
        em.ratedSynchSpeed == 500 &&
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower >= 1.1 &&
        em.ratedPower <= 300
      ) {
        return true;
      }

      return false;
    }
    case "PMSM": {
      if (em.efficiencyClass != "IE4" || em.frameMaterial != "cast iron") {
        return false;
      }

      if (
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower >= 1.1 &&
        em.ratedPower <= 2000
      ) {
        return true;
      }

      if (
        em.ratedVoltageY.type == "MV" &&
        em.ratedPower >= 300 &&
        em.ratedPower <= 5000
      ) {
        return true;
      }

      return false;
    }
    case "SyRM":
      if (em.efficiencyClass != "IE4" || em.frameMaterial == "steel") {
        return false;
      }

      if (
        em.ratedSynchSpeed >= 1000 &&
        em.ratedSynchSpeed <= 3000 &&
        em.ratedVoltageY.type == "LV" &&
        em.ratedPower >= 1.1 &&
        em.ratedPower <= 300
      ) {
        return true;
      }
      return false;
  }
}

/*const colorMap = {
  blue: "border-b-4 p-1 border-blue-500",
  violet: "border-b-4 p-1 border-violet-500",
  fuchsia: "border-b-4 p-1 border-fuchsia-500",
  green: "border-b-4 p-1 border-green-500",
  teal: "border-b-4 p-1 border-teal-500",
  cyan: "border-b-4 p-1 border-cyan-500",
  pink: "border-b-4 p-1 border-pink-500",
  red: "border-b-4 p-1 border-red-500",
  orange: "border-b-4 p-1 border-orange-500",
};*/

const colorMap = {
  "border-blue-500": colors.blue[500],
  "border-violet-500": colors.violet[500],
  "border-fuchsia-500": colors.fuchsia[500],
  "border-green-500": colors.green[500],
  "border-teal-500": colors.teal[500],
  "border-cyan-500": colors.cyan[500],
  "border-pink-500": colors.pink[500],
  "border-red-500": colors.red[500],
  "border-orange-500": colors.orange[500],
};

export function findColorEntry(
  candidates: EMachineComponent[],
  em: EMachineComponent,
) {
  const colorEntries = Object.entries(colorMap);

  const index = candidates.findIndex((ec) => ec.designation == em.designation);
  if (index == -1) {
    throw new Error("Unable to find emachine");
  }

  return colorEntries[index % colorEntries.length];
}
