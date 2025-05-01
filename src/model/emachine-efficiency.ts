import { EfficiencyClassType } from "./emachine";
import json from "./emachine-efficiency.json";
import { TypeSpeedTorque } from "./emachine-sizing";

const efficiencies = json as Record<
  string,
  Record<EfficiencyClassType, Record<number, number>>
>;

export function getEfficiency100(
  typeSpeedTorque: TypeSpeedTorque,
  efficiencyClass: EfficiencyClassType | null,
) {
  const ratedPower = typeSpeedTorque.ratedPower.toString();
  if (
    efficiencyClass &&
    efficiencies[ratedPower] &&
    efficiencies[ratedPower][efficiencyClass]
  ) {
    const ratedSynchSpeed = Math.max(1000, typeSpeedTorque.ratedSynchSpeed);
    const ratedEfficiency =
      efficiencies[ratedPower][efficiencyClass][ratedSynchSpeed];
    if (ratedEfficiency) {
      return typeSpeedTorque.type == "PMSM"
        ? ratedEfficiency * 1.01
        : ratedEfficiency;
    }
  }

  const K1 = (typeSpeedTorque.ratedSynchSpeed - 50) / 2950;
  const K2 = (typeSpeedTorque.ratedPower / 1000 - 0.1) / 4.9;

  if (typeSpeedTorque.type == "SCIM") {
    return (
      100 *
      (0.94 + (1 / 20) * Math.pow(K1, 0.15)) *
      (0.94 + (1 / 20) * Math.pow(K2, 0.2))
    );
  } else if (typeSpeedTorque.type == "PMSM") {
    return (
      100 *
      (0.944 + (1 / 20) * Math.pow(K1, 0.2)) *
      (0.944 + (1 / 20) * Math.pow(K2, 0.2))
    );
  }
  return 0;
}

export function getPartialEfficiency(load: number, efficiency100: number) {
  return (
    (-0.32 * Math.pow(load, 4) +
      0.98 * Math.pow(load, 3) -
      1.14 * Math.pow(load, 2) +
      0.58 * load +
      0.9 -
      0.1 * Math.pow(1 - load, 2)) *
    efficiency100
  );
}
