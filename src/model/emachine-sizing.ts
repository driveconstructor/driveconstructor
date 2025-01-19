import { Protection } from "./cooling-protection";
import {
  EfficiencyClass,
  EMachineCooling,
  EMachineFrameMaterial,
  EMachineMounting,
  EMachineProtection,
  EMachineType,
  ERatedPower,
} from "./emachine";
import { EMachineComponent } from "./emachine-component";

export const ERatedSynchSpeed = [
  3000, 1500, 1000, 750, 600, 500, 400, 300, 200, 100,
] as const;

export type TypeSpeedAndTorque = {
  type: (typeof EMachineType)[number];
  ratedPower: (typeof ERatedPower)[number];
  ratedSynchSpeed: (typeof ERatedSynchSpeed)[number];
  ratedSpeed: number;
  ratedTorque: number;
};

export type Mechanism = {
  powerOnShaft: number;
  ratedTorque: number;
  torqueOverload: number;
};

export function findTypeSpeedAndTorque(
  mechanismSpeed: number,
  mechanismTorque: number,
): TypeSpeedAndTorque[] {
  return ERatedSynchSpeed.filter(
    (speed) => speed > mechanismSpeed / 1.2,
  ).flatMap((ratedSynchSpeed) =>
    EMachineType.flatMap((type) =>
      ERatedPower.map((ratedPower) => {
        const slip = 0.053 * Math.pow(ratedPower, -0.38);
        const ratedSpeed =
          type == "SCIM" ? ratedSynchSpeed * (1 - slip) : ratedSynchSpeed;
        const ratedTorque = 1000 * (ratedPower / ratedSpeed) * 9.55;

        const result = {
          type,
          ratedPower,
          ratedSynchSpeed,
          ratedSpeed,
          ratedTorque,
        };
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

export type VoltageY = {
  value: (typeof Voltage)[number];
  min: number;
  max: number;
};

export const LowVoltage = [400, 660] as const;

export const MediumVoltage = [3300, 6600, 10000] as const;

export const Voltage = [...LowVoltage, ...MediumVoltage];

export function findVoltageY(
  altitude: number,
  systemVoltage: number,
): VoltageY {
  const derating = altitude > 2000 ? 1 - 0.00015 * (altitude - 2000) : 1;
  const deratedVoltage = systemVoltage / derating;

  const value = [...Voltage].sort(
    (a, b) => Math.abs(a - deratedVoltage) - Math.abs(b - deratedVoltage),
  )[0];

  return { min: value * 0.9, value, max: value * 1.1 };
}

export function emachineCatalog(
  tstList: TypeSpeedAndTorque[],
  ratedVoltageY: VoltageY,
): any {
  return EMachineCooling.flatMap((cooling) =>
    EMachineFrameMaterial.flatMap((frameMaterial) =>
      EMachineMounting.flatMap((mountung) =>
        EMachineProtection.flatMap((protection) =>
          EfficiencyClass.flatMap((efficiencyClass) =>
            tstList.map((tst) => {
              const price = 10;
              const maximumSpeed = tst.ratedSynchSpeed * 1.2;
              const cosFi100 = 1;
              const cosFi75 = 1;
              const cosFi50 = 1;
              const efficiency100 = 1;
              const efficiency75 = 1;
              const efficiency50 = 1;
              const efficiency25 = 1;
              const ratedCurrent =
                (tst.ratedPower * 1000) /
                (((Math.sqrt(3) * ratedVoltageY.value * efficiency100) / 100) *
                  cosFi100);
              const workingCurrent = null;
              const torqueOverload = null;
              const mounting = null;
              const shaftHeight = null;
              const outerDiameter = null;
              const length = null;
              const volume = null;
              const momentOfInertia = null;
              const footPrint = null;
              const weight = null;
              const designation = null;

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
                mountung,
                protection,
                ...tst,
                ratedVoltageY,
              };
            }),
          ),
        ),
      ),
    ),
  );
}
