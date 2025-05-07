import { Cooling, Protection } from "./cooling-protection";
import { DryOil, Integration, Power, Winding } from "./trafo";
import { TrafoComponent } from "./trafo-component";

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

function findTrafo(): TrafoComponent[] {
  return Voltage.flatMap((voltageLVmax) =>
    Voltage.flatMap((voltageHVmax) =>
      Power.flatMap((ratedPower) =>
        Winding.flatMap((typeIII) =>
          Integration.flatMap((typeIV) =>
            DryOil.flatMap((typeII) =>
              Cooling.flatMap((cooling) =>
                Protection.flatMap((protection) => {
                  const currentHVmax =
                    (ratedPower * 1000) / (Math.sqrt(3) * voltageHVmax);
                  const currentLVmax =
                    (ratedPower * 1000) / (Math.sqrt(3) * voltageLVmax);
                  const efficiency100 =
                    (0.98 + (0.005 * (ratedPower / 1000)) / 15) * 100;
                  const weight = 0; // getWeight(trafo) * 1000;
                  const volume = weight / 1000;
                  const depth = 0.72 * Math.pow(volume, 1 / 3);
                  const height = 1.3 * Math.pow(volume, 1 / 3);
                  const width = 1.08 * Math.pow(volume, 1 / 3);
                  const ratedCoolantTemperature = 0; // getRatedCoolantTemperature(trafo);
                  const price = 15 * Math.pow(weight, 0.88);
                  const designation = ""; //getDesignation(trafo);

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
