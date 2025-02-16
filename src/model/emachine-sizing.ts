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
import { emachinDesignation, getCosFi } from "./emachine-utils";
import { round } from "./utils";
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
};

export function findTypeSpeedAndTorque(
  type: (typeof EMachineType)[number] | null,
  mechanismSpeed: number,
  mechanismTorque: number,
): TypeSpeedTorque[] {
  return ERatedSynchSpeed.filter(
    (speed) => speed > mechanismSpeed / 1.2,
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
          ratedSpeed: Math.round(ratedSpeed),
          ratedTorque: Math.round(ratedTorque),
        };
      }).filter(
        (o) =>
          o.ratedSpeed <= mechanismSpeed * 2 &&
          o.ratedTorque >= mechanismTorque &&
          o.ratedTorque < mechanismTorque / 0.6,
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
              const efficiency100 = 100;
              const efficiency75 = 1;
              const efficiency50 = 1;
              const efficiency25 = 1;
              const ratedCurrent = round(
                (typeSpeedTorque.ratedPower * 1000) /
                  (((Math.sqrt(3) * ratedVoltageY.value * efficiency100) /
                    100) *
                    cosFi100),
              );
              const workingCurrent = 0;
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
