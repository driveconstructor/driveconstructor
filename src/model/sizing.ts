import { BaseCandidates } from "./component";
import { EMachineComponent } from "./emachine-component";
import { emachineCatalog, findTypeSpeedAndTorque } from "./emachine-sizing";
import { System } from "./system";
import { findVoltageY } from "./voltage";

function distinctSyncSpeedAndType(emachines: EMachineComponent[]) {
  const set = new Set();
  return emachines.filter((em) => {
    const key = em.ratedSynchSpeed + em.type;
    if (set.has(key)) {
      return false;
    }
    set.add(key);
    return true;
  });
}

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

  const catalog = emachineCatalog(
    system.input.emachine,
    typeSpeedAndTorqueList,
    voltageY,
  );

  const emachine = distinctSyncSpeedAndType(catalog)
    .sort(
      (a, b) =>
        a.ratedSynchSpeed - b.ratedSynchSpeed ||
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
