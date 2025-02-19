import {
  EfficiencyClass,
  EMachine,
  EMachineCooling,
  EMachineFrameMaterial,
  EMachineMounting,
  EMachineProtection,
  EMachineType,
  ERatedPower,
} from "./emachine";
import { EMachineComponent } from "./emachine-component";
import { getEfficiency100, getPartialEfficiency } from "./emachine-efficiency";
import { emachinDesignation } from "./emachine-utils";
import { Mechanism } from "./sizing";
import { VoltageY } from "./voltage";

export const ERatedSynchSpeed = [
  3000, 1500, 1000, 750, 600, 500, 400, 300, 200, 100,
] as const;

export type TypeSpeedTorque = {
  type: (typeof EMachineType)[number];
  ratedPower: (typeof ERatedPower)[number];
  ratedSynchSpeed: (typeof ERatedSynchSpeed)[number];
  ratedSpeed: number;
  ratedTorque: number;
  mechanism: Mechanism;
};

export function findTypeSpeedTorque(
  type: (typeof EMachineType)[number] | null,
  mechanism: Mechanism,
): TypeSpeedTorque[] {
  return ERatedSynchSpeed.filter(
    (speed) => speed > mechanism.ratedSpeed / 1.2,
  ).flatMap((ratedSynchSpeed) =>
    EMachineType.filter((t) => type == null || t == type).flatMap((type) =>
      ERatedPower.map((ratedPower) => {
        const slip = 0.053 * Math.pow(ratedPower, -0.38);
        const ratedSpeed =
          type == "SCIM" ? ratedSynchSpeed * (1 - slip) : ratedSynchSpeed;
        const ratedTorque = 1000 * (ratedPower / ratedSpeed) * 9.55;

        return {
          type,
          ratedPower,
          ratedSynchSpeed,
          ratedSpeed,
          ratedTorque,
          mechanism,
        };
      }).filter(
        (o) =>
          o.ratedSpeed <= mechanism.ratedSpeed * 2 &&
          o.ratedTorque >= mechanism.ratedTorque &&
          o.ratedTorque < mechanism.ratedTorque / 0.6,
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
              const price = 10;
              const maximumSpeed = typeSpeedTorque.ratedSynchSpeed * 1.2;
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
              const torqueOverload = 0;
              const shaftHeight = 0;
              const outerDiameter = 0;
              const length = 1;
              const volume = 0;
              const momentOfInertia = 0;
              const footPrint = 0;
              const weight = 0;

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

              return {
                price,
                maximumSpeed,
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
                footPrint,
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
