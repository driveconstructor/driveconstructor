import {
  EfficiencyClass,
  EfficiencyClassType,
  EMachine,
  EMachineCooling,
  EMachineCoolingType,
  EMachineFrameMaterial,
  EMachineFrameMaterialType,
  EMachineMounting,
  EMachineMountingType,
  EMachineProtection,
  EMachineProtectionType,
  EMachineType,
  EMachineTypeAlias,
  ERatedPower,
  ShaftHeight,
} from "./emachine";
import { EMachineComponent } from "./emachine-component";
import { getEfficiency100, getPartialEfficiency } from "./emachine-efficiency";
import { emachinDesignation } from "./emachine-utils";
import { Mechanism } from "./sizing";
import { closest } from "./utils";
import { VoltageY } from "./voltage";

export const ERatedSynchSpeed = [
  3000, 1500, 1000, 750, 600, 500, 400, 300, 200, 100,
] as const;

export type TypeSpeedTorque = {
  type: EMachineTypeAlias;
  ratedPower: (typeof ERatedPower)[number];
  ratedSynchSpeed: (typeof ERatedSynchSpeed)[number];
  ratedSpeed: number;
  ratedTorque: number;
  maximumSpeed: number;
  mechanism: Mechanism;
};

export function findTypeSpeedTorque(
  type: EMachineTypeAlias | null,
  mechanism: Mechanism,
): TypeSpeedTorque[] {
  return ERatedSynchSpeed.flatMap((ratedSynchSpeed) =>
    EMachineType.filter((t) => type == null || t == type).flatMap((type) =>
      ERatedPower.map((ratedPower) => {
        const slip = 0.053 * Math.pow(ratedPower, -0.38);
        const ratedSpeed =
          type == "SCIM" ? ratedSynchSpeed * (1 - slip) : ratedSynchSpeed;
        const ratedTorque = 1000 * (ratedPower / ratedSpeed) * 9.55;
        const maximumSpeed = ratedSynchSpeed * 1.2;

        return {
          type,
          ratedPower,
          ratedSynchSpeed,
          ratedSpeed,
          ratedTorque,
          maximumSpeed,
          mechanism,
        };
      }).filter(
        (o) =>
          o.maximumSpeed >= mechanism.ratedSpeed &&
          o.ratedSpeed <= mechanism.ratedSpeed * 2 &&
          o.ratedTorque >= mechanism.ratedTorque &&
          o.ratedTorque < mechanism.ratedTorque / 0.6 &&
          o.ratedTorque * o.ratedSpeed >=
            mechanism.ratedSpeed * mechanism.ratedTorque &&
          (!mechanism.linear ||
            (o.ratedTorque / o.ratedSpeed) * mechanism.minimalSpeed +
              o.ratedTorque / 2 >
              mechanism.ratedTorque),
      ),
    ),
  );
}

export function emachineCatalog(
  em: EMachine,
  typeSpeedTorqueList: TypeSpeedTorque[],
  ratedVoltageY: VoltageY,
): EMachineComponent[] {
  return EMachineCooling.filter(
    (c) => em.cooling == null || c == em.cooling,
  ).flatMap((cooling) =>
    EMachineFrameMaterial.filter(
      (fm) => em.frameMaterial == null || fm == em.frameMaterial,
    ).flatMap((frameMaterial) =>
      EMachineMounting.filter(
        (m) => em.mounting == null || m == em.mounting,
      ).flatMap((mounting) =>
        EMachineProtection.filter(
          (p) => em.protection == null || p == em.protection,
        ).flatMap((protection) =>
          EfficiencyClass.filter(
            (ec) => em.efficiencyClass == null || ec == em.efficiencyClass,
          ).flatMap((efficiencyClass) =>
            typeSpeedTorqueList.map((typeSpeedTorque) => {
              const cosFi100 = getCosFi(typeSpeedTorque, 1);
              const cosFi75 = getCosFi(typeSpeedTorque, 0.95);
              const cosFi50 = getCosFi(typeSpeedTorque, 0.9);
              const efficiency100 = getEfficiency100(
                typeSpeedTorque,
                efficiencyClass,
              );
              const efficiency75 = getPartialEfficiency(0.75, efficiency100);
              const efficiency50 = getPartialEfficiency(0.5, efficiency100);
              const efficiency25 =
                typeSpeedTorque.type == "PMSM"
                  ? 0.987 * efficiency100
                  : 0.931 * efficiency100;

              const ratedCurrent = getRatedCurrent(
                typeSpeedTorque,
                ratedVoltageY,
                efficiency100,
                cosFi100,
              );
              const workingCurrent = getWorkingCurrent(
                typeSpeedTorque,
                ratedCurrent,
              );
              const torqueOverload = getTorqueOverload(typeSpeedTorque.type);
              const weight = getWeight(
                ratedVoltageY,
                typeSpeedTorque,
                cooling,
                protection,
                efficiencyClass,
                frameMaterial,
              );
              const volume = weight / 3500;
              const shaftHeight = getShaftHeight(
                typeSpeedTorque.ratedPower,
                volume,
              );
              const price = getPrice(
                ratedVoltageY,
                typeSpeedTorque,
                weight,
                protection,
                frameMaterial,
                mounting,
                efficiencyClass,
              );

              const designation = emachinDesignation(
                typeSpeedTorque,
                ratedVoltageY,
                shaftHeight,
                cooling,
                protection,
                frameMaterial,
                mounting,
                efficiencyClass,
              );

              const outerDiameter = (shaftHeight / 1000) * 2;
              const length =
                volume / ((3.1416 * Math.pow(outerDiameter, 2)) / 4);
              const momentOfInertia = getMomentOfInertia(
                typeSpeedTorque.ratedPower,
                weight,
              );
              const footprint = length * outerDiameter;

              return {
                price,
                efficiencyClass,
                efficiency100,
                efficiency75,
                efficiency50,
                efficiency25,
                ratedCurrent,
                workingCurrent,
                torqueOverload,
                cosFi100,
                cosFi75,
                cosFi50,
                mounting,
                shaftHeight,
                outerDiameter,
                length,
                volume,
                momentOfInertia,
                footprint,
                weight,
                designation,
                cooling,
                frameMaterial,
                protection,
                ...typeSpeedTorque,
                ratedVoltageY,
              };
            }),
          ),
        ),
      ),
    ),
  );
}

function getCosFi(typeSpeedTorque: TypeSpeedTorque, k: number): number {
  if (typeSpeedTorque.type == "SCIM" || typeSpeedTorque.type == "SyRM") {
    const coeff = 0.09 * Math.pow(typeSpeedTorque.ratedSpeed, 0.28);
    const inpower = 114 * Math.pow(typeSpeedTorque.ratedSpeed, -1.19);
    return coeff * Math.pow(typeSpeedTorque.ratedPower, inpower) * (k ? k : 1);
  } else if ((typeSpeedTorque.type = "PMSM")) {
    return 0.95;
  }

  throw new Error("unsupported type");
}

function getRatedCurrent(
  typeSpeedTorque: TypeSpeedTorque,
  ratedVoltageY: VoltageY,
  efficiency100: number,
  cosFi100: number,
) {
  return (
    (typeSpeedTorque.ratedPower * 1000) /
    (((Math.sqrt(3) * ratedVoltageY.value * efficiency100) / 100) * cosFi100)
  );
}

function getWorkingCurrent(
  typeSpeedTorque: TypeSpeedTorque,
  ratedCurrent: number,
): number {
  if (
    typeSpeedTorque.ratedSpeed * 1.05 <
    typeSpeedTorque.mechanism.ratedSpeed
  ) {
    return (
      ((((ratedCurrent * typeSpeedTorque.mechanism.powerOnShaft) /
        typeSpeedTorque.mechanism.ratedSpeed) *
        9.55) /
        typeSpeedTorque.ratedTorque) *
      1000
    );
  } else {
    return (
      (ratedCurrent * typeSpeedTorque.mechanism.powerOnShaft) /
      typeSpeedTorque.ratedPower
    );
  }
}

function getK2(type: EMachineTypeAlias) {
  switch (type) {
    case "SCIM":
      return 1;
    case "PMSM":
      return 0.8;
    case "SyRM":
      return 0.9;
  }
}

function getK8(
  cooling: EMachineCoolingType,
  protection: EMachineProtectionType,
) {
  switch (cooling) {
    case "IC411":
    case "IC416":
      switch (protection) {
        case "IP54/55":
          return 1;
        case "IP21/23":
          return 0.8;
      }
      break;
    case "IC71W":
      return 0.7;
  }
}

function getK12(efficiencyClass: EfficiencyClassType) {
  switch (efficiencyClass) {
    // case null: return 1.12; !?
    case "IE2":
      return 1;
    case "IE3":
      return 1.12;
    case "IE4":
      return 1.15;
  }
}

function getK13(frameMaterial: EMachineFrameMaterialType) {
  switch (frameMaterial) {
    case "cast iron":
      return 1;
    case "steel":
      return 0.95;
    case "aluminum":
      return 0.7;
  }
}

function getWeight(
  ratedVoltageY: VoltageY,
  typeSpeedTorque: TypeSpeedTorque,
  cooling: EMachineCoolingType,
  protection: EMachineProtectionType,
  efficiencyClass: EfficiencyClassType,
  frameMaterial: EMachineFrameMaterialType,
) {
  const K1 = ratedVoltageY.value > 1000 ? 3 : 2.8;
  const K2 = getK2(typeSpeedTorque.type);
  const K8 = getK8(cooling, protection);
  const K12 = getK12(efficiencyClass);
  const K13 = getK13(frameMaterial);

  return (
    1000 *
    K1 *
    K2 *
    K8 *
    K12 *
    K13 *
    Math.pow(typeSpeedTorque.ratedPower / 1000, 0.8) *
    Math.pow(400 / Math.pow(typeSpeedTorque.ratedSpeed, 0.9) + 1, 1.43)
  );
}

function getK3(type: EMachineTypeAlias) {
  switch (type) {
    case "SCIM":
      return 1;
    case "PMSM":
      return 1.2;
    case "SyRM":
      return 1;
  }
}

function getK5(protection: EMachineProtectionType) {
  switch (protection) {
    case "IP54/55":
      return 1;
    case "IP21/23":
      return 0.97;
  }
}

function getK6(frameMaterial: EMachineFrameMaterialType) {
  switch (frameMaterial) {
    case "cast iron":
      return 0.95;
    case "steel":
      return 1;
    case "aluminum":
      return 1.2;
  }
}

function getK7(mounting: EMachineMountingType) {
  switch (mounting) {
    case "B3":
      return 1;
    case "B5":
      return 1.02;
    case "B35":
      return 1.05;
  }
}

function getPriceIncrease(
  ratedPower: number,
  efficiencyClass: EfficiencyClassType,
) {
  const priceIncrease = 40 - 36 * Math.pow(ratedPower / 1300, 0.5);
  switch (efficiencyClass) {
    case "IE2":
      return 0;
    case "IE3":
      return priceIncrease;
    case "IE4":
      return priceIncrease * 1.7;
  }
}

function getPrice(
  ratedVoltageY: VoltageY,
  typeSpeedTorque: TypeSpeedTorque,
  weight: number,
  protection: EMachineProtectionType,
  frameMaterial: EMachineFrameMaterialType,
  mounting: EMachineMountingType,
  efficiencyClass: EfficiencyClassType,
) {
  const K11 = ratedVoltageY.value > 1000 ? 30 : 20;
  const a = ratedVoltageY.value > 1000 ? 0.8 : 0.9;
  const K9 = typeSpeedTorque.ratedSynchSpeed === 1500 ? 0.95 : 1;
  const price =
    1000 *
    K11 *
    getK3(typeSpeedTorque.type) *
    getK5(protection) *
    getK6(frameMaterial) *
    getK7(mounting) *
    K9 *
    Math.pow(weight / 1000, a);
  return (
    price +
    (price *
      Math.max(
        0,
        getPriceIncrease(typeSpeedTorque.ratedPower, efficiencyClass),
      )) /
      100
  );
}

function getTorqueOverload(type: EMachineTypeAlias) {
  switch (type) {
    case "SCIM":
      return 2.4;
    case "PMSM":
    case "SyRM":
      return 1.5;
  }
}

function getShaftHeight(ratedPower: number, volume: number) {
  const DtoLcurve = 1.4 + 0.2 * Math.pow(ratedPower, 0.2);
  const SHapprox = 0.5 * Math.pow(((volume / DtoLcurve) * 4) / 3.1416, 1 / 3);
  return closest(ShaftHeight, SHapprox * 1000);
}

function getMomentOfInertia(ratedPower: number, weight: number) {
  const K = 30 * Math.pow(ratedPower, -0.4);
  return 1e-5 * K * Math.pow(weight, 1.7);
}
