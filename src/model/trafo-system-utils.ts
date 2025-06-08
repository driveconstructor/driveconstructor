import { PumpFcTr, PumpGbFcTr } from "./pump-system";
import { splitRange } from "./utils";
import { WinchFcTr } from "./winch-system";
import { WindFcTr, WindGbFcTr } from "./wind-system";

export function updateTrSystem<
  T extends PumpFcTr | PumpGbFcTr | WindFcTr | WindGbFcTr | WinchFcTr,
>(system: T): T {
  const trafo = system.input.trafo;
  const grid = system.input.grid;

  const voltageLV = splitRange(trafo.sideVoltageLV);

  const minRatio = grid.voltage / voltageLV.min;
  const maxRatio = grid.voltage / voltageLV.max;

  const ratio = ((1 + Number(trafo.tappings)) * (maxRatio + minRatio)) / 2;

  return {
    ...system,
    input: {
      ...system.input,
      trafo: { ...trafo, sideVoltageHV: grid.voltage, ratio },
    },
  };
}
