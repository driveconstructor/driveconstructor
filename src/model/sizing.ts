import { BaseCandidates } from "./component";
import { emachineCatalog, findTypeSpeedAndTorque } from "./emachine-sizing";
import { System } from "./system";
import { findVoltageY } from "./voltage";

export function findCandidates(system: System): BaseCandidates {
  let mechanismSpeed;
  let mechanismTorque;

  if (
    system.kind == "pump-fc" ||
    system.kind == "pump-fc-tr" ||
    system.kind == "pump-gb-fc" ||
    system.kind == "pump-gb-fc-tr"
  ) {
    mechanismSpeed = system.input.pump.ratedSpeed;
    mechanismTorque = system.input.pump.ratedTorque;
  } else {
    throw new Error("Unsupported");
  }

  const typeSpeedAndTorqueList = findTypeSpeedAndTorque(
    system.input.emachine.type,
    mechanismSpeed,
    mechanismTorque,
  );
  const deratedVoltage =
    system.input.grid.voltage / system.input.emachine.voltageDerating;
  const voltageY = findVoltageY(deratedVoltage);

  const emachine = emachineCatalog(system.input.emachine,typeSpeedAndTorqueList, voltageY)
    .sort(
      (a, b) =>
        a.ratedSynchSpeed - b.ratedSpeed ||
        a.type.localeCompare(b.type) ||
        a.ratedPower - b.ratedPower,
    )
    .slice(0, 5);

  return {
    emachine,
    cable: [],
    fconvertor: [],
  };
}
