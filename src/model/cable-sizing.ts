import {
  Cable,
  CrossSection,
  Material,
  MaterialType,
  NumberOfRuns,
  NumberOfRunsType,
} from "./cable";
import { CableComponent } from "./cable-component";
import { EMachineComponent } from "./emachine-component";

const Voltage = [1, 3, 6, 10, 15];

export function findCableComponent(
  cable: Cable,
  emachine: EMachineComponent,
): CableComponent[] {
  const calculatedCable = calculateCable(cable, emachine);
  if (calculatedCable == null) {
    return [];
  }
  const { numberOfRuns, minCrossSection } = calculatedCable;

  return Voltage.filter(
    (voltage) => voltage >= emachine.ratedVoltageY.max / 1000,
  )
    .flatMap((voltage) => {
      return Material.filter((material) => material == cable.material).flatMap(
        (material) =>
          CrossSection.filter(
            (crossSection) => crossSection >= minCrossSection,
          ).flatMap((crossSection) => {
            const resistancePerMeter =
              (getRho(material) / (crossSection * 1e-6)) * 1.15;
            const ins = (1.1 * voltage) / 2.5;
            const ds = Math.sqrt(crossSection / 3.1416);
            const reactancePerHz =
              (0.55 + 0.2 * Math.log(2 + (4 * ins) / ds)) * 2 * 3.1416 * 1e-3;
            const K1 = getK1(material);
            const pricePerMeter =
              K1 * (1 + voltage * 0.03) * Math.pow(crossSection, 0.8);
            const designation = getDesignation(material, crossSection, voltage);
            const length = cable.length;
            const price = length * numberOfRuns * pricePerMeter;
            const voltageDrop = Math.sqrt(
              Math.pow(
                emachine.workingCurrent * resistancePerMeter * length,
                2,
              ) +
                Math.pow(
                  (emachine.workingCurrent *
                    reactancePerHz *
                    length *
                    50) /*Gz*/ /
                    1000,
                  2,
                ),
            );
            const losses =
              (((Math.pow(emachine.workingCurrent, 2) * resistancePerMeter) /
                1000) *
                length *
                3) /
              numberOfRuns;

            const efficiency100 =
              ((emachine.ratedPower - losses) / emachine.ratedPower) * 100;

            return {
              length,
              material,
              crossSection,
              numberOfRuns,
              voltage,
              reactancePerHz,
              resistancePerMeter,
              pricePerMeter,
              price,
              designation,
              voltageDrop,
              losses,
              efficiency100,
            };
          }),
      );
    })
    .filter((cable) => {
      if (cable.voltage == 1 && cable.crossSection > 240) {
        return false;
      }

      return !(cable.voltage != 1 && cable.crossSection < 50);
    })
    .sort((a, b) => a.voltage - b.voltage)
    .slice(0, 1);
}

function getRho(material: MaterialType) {
  switch (material) {
    case "copper":
      return 1.68e-8;
    case "aluminum":
      return 2.65e-8;
  }
}

function getK1(material: MaterialType) {
  switch (material) {
    case "copper":
      return 0.6;
    case "aluminum":
      return 0.2;
  }
}

function getDesignation(
  material: MaterialType,
  crossSection: number,
  voltage: number,
) {
  const result = [];
  switch (material) {
    case "copper":
      result.push("CU");
      break;
    case "aluminum":
      result.push("AL");
      break;
    default:
      result.push("XXX");
  }

  result.push("3x" + crossSection.toFixed().padStart(3, "0"));
  result.push(voltage.toFixed().padStart(2, "0") + "kV");

  return result.join("-");
}

function getMaxCurrentDensity(
  ratedVoltageYMax: number,
  workingCurrent: number,
  K1: number,
  n: number,
) {
  return (
    Math.pow(12 - (0.5 * ratedVoltageYMax) / 1000, 1.6) /
    Math.pow(workingCurrent / n, 0.6) /
    K1
  );
}

function calculateCable(cable: Cable, emachine: EMachineComponent) {
  let K1, K2;
  switch (cable.material) {
    case "copper":
      K1 = 1;
      K2 = 1.4;
      break;
    case "aluminum":
      K1 = 1.3;
      K2 = 1.0;
      break;
  }

  const workingCurrent = emachine.workingCurrent;
  let result: {
    maxCurrentDensity: number;
    numberOfRuns: NumberOfRunsType;
  };

  if (cable.numberOfRuns == null) {
    result = NumberOfRuns.map((numberOfRuns) => {
      const maxCurrentDensity = getMaxCurrentDensity(
        emachine.ratedVoltageY.max,
        workingCurrent,
        K1,
        numberOfRuns,
      );
      return { maxCurrentDensity, numberOfRuns };
    }).filter((r) => r.maxCurrentDensity > K2)[0];
  } else {
    const maxCurrentDensity = getMaxCurrentDensity(
      emachine.ratedVoltageY.max,
      workingCurrent,
      K1,
      cable.numberOfRuns,
    );
    result = { maxCurrentDensity, numberOfRuns: cable.numberOfRuns };
  }

  let minCrossSection;
  if (cable.crossSection == null) {
    const crossSectionCalc =
      workingCurrent / result.numberOfRuns / result.maxCurrentDensity;
    minCrossSection = CrossSection.find((v) => v >= crossSectionCalc);
    if (minCrossSection == null) {
      return null;
    }
  } else {
    minCrossSection = cable.crossSection;
  }

  return { ...result, minCrossSection };
}
