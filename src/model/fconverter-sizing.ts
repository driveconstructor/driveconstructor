import { Cooling, FcCoolingType, Protection } from "./cooling-protection";
import { FcVoltage, findFcVoltageY } from "./fconverter-voltage";
import {
  FConverter,
  FConverterMounting,
  FConverterPower,
  FConverterType,
  FConverterTypeAlias,
} from "./fconverter";
import { FConverterComponent } from "./fconverter-component";
import { Voltage } from "./voltage";
import { closest } from "./utils";
import { getDesignation } from "./fconverter-utils";
import { FConverterVoltageFilering } from "./fconverter-types";

export function findFcConverters(
  systemVoltage: number,
  cableEfficiency100: number,
  fconverter: FConverter,
  emachineWorkingCurrent: number,
): FConverterComponent[] {
  const deratedVoltage = systemVoltage / fconverter.voltageDerating;

  return FConverterType.filter((type) => type == fconverter.type)
    .flatMap((type) =>
      FcVoltage.map(findFcVoltageY)
        .filter(
          (voltageY) =>
            voltageY.min <= deratedVoltage && deratedVoltage <= voltageY.max,
        )
        .flatMap((voltage) =>
          FConverterPower.filter(
            (ratedPower) =>
              fconverter.ratedPower == null ||
              ratedPower == fconverter.ratedPower,
          ).flatMap((ratedPowerLO) =>
            Cooling.filter((cooling) => cooling == fconverter.cooling).flatMap(
              (cooling) =>
                Protection.filter(
                  (proteciton) => proteciton == fconverter.protection,
                ).flatMap((protection) =>
                  FConverterMounting.filter(
                    (mounting) =>
                      fconverter.mounting == null ||
                      mounting == fconverter.mounting,
                  ).flatMap((mounting) => {
                    const ratedPowerHO =
                      FConverterPower[
                        Math.max(0, FConverterPower.indexOf(ratedPowerLO) - 1)
                      ];
                    const efficiency100 = getEfficiency100(
                      ratedPowerLO,
                      cooling,
                      type,
                    );
                    const cosFi100 = getCosFi100(type);
                    const currentLO = getCurrent(
                      ratedPowerLO,
                      voltage.value,
                      efficiency100,
                      cosFi100,
                    );
                    const currentHO = getCurrent(
                      ratedPowerHO,
                      voltage.value,
                      efficiency100,
                      cosFi100,
                    );
                    return {
                      voltage,
                      price: 0,
                      workingVoltage: 0,
                      currentLO,
                      currentHO,
                      efficiency100,
                      cosFi100: 0,
                      height: 0,
                      width: 0,
                      depth: 0,
                      weight: 0,
                      gridSideFilter: null,
                      machineSideFilter: null,
                      efficiency75: 0,
                      efficiency50: 0,
                      efficiency25: 0,
                      footprint: 0,
                      volume: 0,
                      ratedPower: ratedPowerLO,
                      mounting,
                      cooling,
                      protection,
                      designation: getDesignation(
                        type,
                        voltage,
                        ratedPowerLO,
                        protection,
                        cooling,
                        mounting,
                      ),
                      type,
                    };
                  }),
                ),
            ),
          ),
        ),
    )
    .filter((fc) => FConverterVoltageFilering[fc.type](fc))
    .filter((fc) => {
      const efficiencyK = cableEfficiency100 / 100;
      const current =
        emachineWorkingCurrent /
        fconverter.overallCurrentDerating /
        efficiencyK;
      return fc.currentLO >= current;
    });
  // .slice(0, 5);
}

function getK1(cooling: FcCoolingType) {
  switch (cooling) {
    case "air":
      return 0;
    case "water":
      return 1;
  }
}

function getK2(type: FConverterTypeAlias) {
  switch (type) {
    case "2Q-3L-NPC-VSC":
      return 0;
    case "4Q-3L-NPC-VSC":
      return 1;
    case "2Q-ML-SCHB-VSC":
      return 0;
    case "4Q-ML-SCHB-VSC":
      return 1;
  }

  throw new Error("Unsupported !?");
}

function getEfficiency100(
  ratedPowerLO: number,
  cooling: FcCoolingType,
  type: FConverterTypeAlias,
) {
  switch (type) {
    case "2Q-2L-VSC-6p":
    case "2Q-2L-VSC-12p":
      return 98;
    case "4Q-2L-VSC":
      return 97;
    default:
      const K1 = getK1(cooling);
      const K2 = getK2(type);
      return (
        (0.98 + ratedPowerLO / 1000 / 2000 + K1 * 0.003 - K2 * 0.0003) * 100
      );
  }
}

export function getCosFi100(type: FConverterTypeAlias) {
  switch (type) {
    case "2Q-2L-VSC-6p":
    case "2Q-2L-VSC-12p":
      return 0.98;
    case "4Q-2L-VSC":
      return 1;
    case "2Q-3L-NPC-VSC":
      return 0.96;
    case "4Q-3L-NPC-VSC":
      return 1;
    case "2Q-ML-SCHB-VSC":
      return 0.96;
    case "4Q-ML-SCHB-VSC":
      return 1;
  }
}

function getCurrent(
  ratedPower: number,
  ratedVoltage: number,
  efficiency100: number,
  cosFi100: number,
) {
  return (
    (1000 * ratedPower) /
    (((Math.sqrt(3) * ratedVoltage * efficiency100) / 100) * cosFi100)
  );
}
