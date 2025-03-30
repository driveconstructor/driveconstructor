import { Cooling, Protection } from "./cooling-protection";
import { FcVoltage, findFcVoltageY } from "./fconverter-voltage";
import {
  FConverterMounting,
  FConverterPower,
  FConverterType,
} from "./fconverter";
import { FConverterComponent } from "./fconverter-component";
import { Voltage } from "./voltage";

const Params = [
  FcVoltage, // 0
  FConverterPower, // 1
  Cooling, // 2
  Protection, // 3
  FConverterMounting, // 4
];

export function findFcConverters(): FConverterComponent[] {
  return FConverterType.flatMap((type) =>
    FcVoltage.flatMap((voltage) =>
      FConverterPower.flatMap((ratedPower) =>
        Cooling.flatMap((cooling) =>
          Protection.flatMap((protection) =>
            FConverterMounting.flatMap((mounting) => {
              return {
                voltage: findFcVoltageY(voltage),
                price: 0,
                workingVoltage: 0,
                currentLO: 0,
                currentHO: 0,
                efficiency100: 0,
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
                ratedPower,
                mounting,
                cooling,
                protection,
                designation: "XXX",
                type,
              };
            }),
          ),
        ),
      ),
    ),
  );
}
