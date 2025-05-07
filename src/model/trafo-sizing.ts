import { EMachineProtection, FcCooling } from "./cooling-protection";
import { DryOil, Integration, Power, TypeIIIAlias, Winding } from "./trafo";
import { TrafoComponent } from "./trafo-component";
import {
  getDesignation,
  getRatedCoolantTemperature,
  getWeight,
} from "./trafo-utils";

const Voltage = [440, 700, 2500, 3300, 4200, 6600, 11000];

/*const Params = [
  Voltage, // 0
  Voltage, // 1
  Power, // 2
  Winding, // 3 typeIII
  Integration, // 4 typeIV
  DryOil, // 5 typeII
  Cooling, // 6
  Protection, // 7
];*/

export function findTrafoCandidates(): TrafoComponent[] {
  return Voltage.flatMap((voltageLVmax) =>
    Voltage.flatMap((voltageHVmax) =>
      Power.flatMap((ratedPower) =>
        Winding.filter((typeIII) =>
          trafoFilter(voltageHVmax, voltageHVmax, ratedPower, typeIII),
        ).flatMap((typeIII) =>
          Integration.flatMap((typeIV) =>
            DryOil.flatMap((typeII) =>
              FcCooling.flatMap((cooling) =>
                EMachineProtection.flatMap((protection) => {
                  const currentHVmax =
                    (ratedPower * 1000) / (Math.sqrt(3) * voltageHVmax);
                  const currentLVmax =
                    (ratedPower * 1000) / (Math.sqrt(3) * voltageLVmax);
                  const efficiency100 =
                    (0.98 + (0.005 * (ratedPower / 1000)) / 15) * 100;
                  const weight =
                    getWeight(
                      protection,
                      typeIV,
                      typeIII,
                      cooling,
                      voltageHVmax,
                      ratedPower,
                    ) * 1000;
                  const volume = weight / 1000;
                  const depth = 0.72 * Math.pow(volume, 1 / 3);
                  const height = 1.3 * Math.pow(volume, 1 / 3);
                  const width = 1.08 * Math.pow(volume, 1 / 3);
                  const ratedCoolantTemperature =
                    getRatedCoolantTemperature(cooling);
                  const price = 15 * Math.pow(weight, 0.88);
                  const designation = getDesignation(
                    protection,
                    typeIV,
                    typeII,
                    cooling,
                    voltageHVmax,
                    ratedPower,
                  );

                  return {
                    designation,
                    weight,
                    depth,
                    height,
                    width,
                    price,
                    voltageLVmax,
                    voltageHVmax,
                    currentHVmax,
                    currentLVmax,
                    efficiency100,
                    ratedCoolantTemperature,
                    ratedPower,
                    typeII,
                    typeIII,
                    typeIV,
                    cooling,
                    protection,
                  };
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

function trafoFilter(
  voltageLVmax: number,
  voltageHVmax: number,
  ratedPower: number,
  typeIII: TypeIIIAlias,
) {
  if (voltageLVmax > voltageHVmax) {
    return false;
  }

  // LV to LV
  if (voltageLVmax <= 700 && voltageHVmax <= 700) {
    if (ratedPower > 2000) {
      return false;
    }

    if (typeIII === "multi-winding") {
      return false;
    }

    return true;
  }

  // MV to LV
  if (voltageLVmax <= 700 && voltageHVmax <= 11000 && voltageHVmax >= 2500) {
    if (ratedPower > 2000) {
      return false;
    }

    if (typeIII === "multi-winding") {
      return false;
    }

    return true;
  }

  // MV to MV
  if (voltageLVmax >= 2500 && voltageHVmax >= 2500) {
    return true;
  }

  return false;
}
