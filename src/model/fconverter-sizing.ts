import { FcCooling, FcCoolingType, FcProtection } from "./cooling-protection";
import {
  FConverter,
  FConverterMounting,
  FConverterMountingType,
  FConverterPower,
  FConverterType,
  FConverterTypeAlias,
} from "./fconverter";
import { FConverterComponent } from "./fconverter-component";
import { getPrice } from "./fconverter-price";
import { FConverterVoltageFiltering } from "./fconverter-types";
import { getDesignation } from "./fconverter-utils";
import { FcVoltage, findFcVoltageY } from "./fconverter-voltage";
import { getVolume } from "./fconverter-volume";
import { getWeight } from "./fconverter-weight";
import { FilterComponent, findFiler } from "./filter-component";

function addFilter(
  filter: FilterComponent | null,
  func: (f: FilterComponent) => number,
  nullValue = 0,
): number {
  return filter == null ? nullValue : func(filter);
}

export function findFcConverters(
  systemVoltage: number,
  cableEfficiency100: number,
  fconverter: FConverter,
  emachineWorkingCurrent: number,
  trafoRatio: number,
): FConverterComponent[] {
  const deratedVoltage =
    systemVoltage / fconverter.voltageDerating / trafoRatio;

  return FConverterType.filter((type) => type == fconverter.type)
    .flatMap((type) =>
      FcVoltage.map(findFcVoltageY)
        .filter((v) => v != null)
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
            FcCooling.filter(
              (cooling) => cooling == fconverter.cooling,
            ).flatMap((cooling) =>
              FcProtection.filter(
                (protection) => protection == fconverter.protection,
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

                  const gridSideFilter =
                    fconverter.gridSideFilter == "choke"
                      ? null
                      : findFiler(
                          fconverter.gridSideFilter,
                          emachineWorkingCurrent,
                          voltage.value,
                        );
                  const machineSideFilter = findFiler(
                    fconverter.machineSideFilter,
                    emachineWorkingCurrent,
                    voltage.value,
                  );

                  const efficiency100 =
                    getEfficiency100(ratedPowerLO, cooling, type) *
                    addFilter(gridSideFilter, (f) => f.efficiency / 100, 1) *
                    addFilter(machineSideFilter, (f) => f.efficiency / 100, 1);

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
                  const depth = getDepth(type, mounting, ratedPowerLO);
                  const height = getHeight(type, mounting, ratedPowerLO);

                  const volume =
                    getVolume(
                      type,
                      cooling,
                      protection,
                      cosFi100,
                      efficiency100,
                      voltage.value,
                      ratedPowerLO,
                    ) +
                    addFilter(gridSideFilter, (f) => f.volume) +
                    addFilter(machineSideFilter, (f) => f.volume);

                  const width = volume / height / depth;
                  const weight =
                    getWeight(
                      type,
                      cooling,
                      protection,
                      cosFi100,
                      efficiency100,
                      voltage.value,
                      ratedPowerLO,
                    ) +
                    addFilter(gridSideFilter, (f) => f.weight) +
                    addFilter(machineSideFilter, (f) => f.weight);

                  const price =
                    getPrice(
                      type,
                      mounting,
                      protection,
                      cosFi100,
                      efficiency100,
                      ratedPowerLO,
                    ) +
                    addFilter(gridSideFilter, (f) => f.price) +
                    addFilter(machineSideFilter, (f) => f.price);

                  return {
                    voltage,
                    price,
                    workingVoltage: voltage.value,
                    currentLO,
                    currentHO,
                    efficiency100,
                    cosFi100,
                    height,
                    width,
                    depth,
                    weight,
                    gridSideFilter,
                    machineSideFilter,
                    efficiency75: efficiency75(efficiency100),
                    efficiency50: efficiency50(efficiency100),
                    efficiency25: efficiency25(efficiency100),
                    footprint: width * height,
                    volume,
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
    .filter((fc) => FConverterVoltageFiltering[fc.type](fc))
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

function getCosFi100(type: FConverterTypeAlias): number {
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

function getDepth(
  type: FConverterTypeAlias,
  mounting: FConverterMountingType,
  ratedPowerLO: number,
): number {
  switch (type) {
    case "2Q-2L-VSC-6p":
    case "2Q-2L-VSC-12p":
    case "4Q-2L-VSC":
      switch (mounting) {
        case "floor":
          return 0.6;
        case "wall":
          return ratedPowerLO < 10 ? 0.2 : 0.4;
      }
    case "2Q-3L-NPC-VSC":
    case "4Q-3L-NPC-VSC":
      if (ratedPowerLO < 1000) {
        return 1;
      } else if (ratedPowerLO >= 1000 && ratedPowerLO < 5000) {
        return 1.2;
      }
      return 1.4;
    case "2Q-ML-SCHB-VSC":
    case "4Q-ML-SCHB-VSC":
      return 0.9;
  }
}

function getHeight(
  type: FConverterTypeAlias,
  mounting: FConverterMountingType,
  ratedPowerLO: number,
): number {
  switch (type) {
    case "2Q-2L-VSC-6p":
    case "2Q-2L-VSC-12p":
    case "4Q-2L-VSC": {
      switch (mounting) {
        case "floor":
          return 2.2;
        case "wall":
          return ratedPowerLO < 10 ? 0.5 : 1;
      }
    }
    case "2Q-3L-NPC-VSC":
    case "4Q-3L-NPC-VSC":
    case "2Q-ML-SCHB-VSC":
    case "4Q-ML-SCHB-VSC":
      if (ratedPowerLO < 1000) {
        return 2.2;
      }
      if (ratedPowerLO >= 1000 && ratedPowerLO < 5000) {
        return 2.4;
      }

      return 2.6;
  }
}

function getEfficiency(efficiency100: number, K: number) {
  return 100 - (100 - efficiency100) * K;
}

function efficiency25(efficiency100: number) {
  let K;
  //if (this.input.pump || this.input.wind) {
  K = 1.37;
  //} else if (this.input.conveyor || this.input.winch) {
  // K = 0.85;
  // }

  return getEfficiency(efficiency100, K);
}

function efficiency50(efficiency100: number) {
  let K;
  // if (this.input.pump || this.input.wind) {
  K = 1.13;
  //} else if (this.input.conveyor || this.input.winch) {
  // K = 0.87;
  //}

  return getEfficiency(efficiency100, K);
}

function efficiency75(efficiency100: number) {
  let K;
  //if (this.input.pump || this.input.wind) {
  K = 1.05;
  //} else if (this.input.conveyor || this.input.winch) {
  // K = 0.93;
  //}

  return getEfficiency(efficiency100, K);
}
