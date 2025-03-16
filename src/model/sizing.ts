import { BaseCandidates } from "./component";
import { EMachineComponent } from "./emachine-component";
import { emachineCatalog, findTypeSpeedTorque } from "./emachine-sizing";
import { System } from "./system";
import { findVoltageY } from "./voltage";

export type Mechanism = {
  ratedSpeed: number;
  ratedTorque: number;
  powerOnShaft: number;
  minimalSpeed: number;
  linear: boolean;
};

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
  let mechanism: Mechanism;

  if (
    system.kind == "pump-fc" ||
    system.kind == "pump-fc-tr" ||
    system.kind == "pump-gb-fc" ||
    system.kind == "pump-gb-fc-tr"
  ) {
    mechanism = {
      ratedSpeed: system.input.pump.ratedSpeed,
      ratedTorque: system.input.pump.ratedTorque,
      powerOnShaft: system.input.pump.powerOnShaft,
      minimalSpeed: system.input.pump.minimalSpeed,
      linear:
        system.input.emachine.cooling == "IC411" &&
        system.input.pump.type == "positive displacement",
    };
  } else {
    throw new Error("Unsupported");
  }

  const typeSpeedAndTorqueList = findTypeSpeedTorque(
    system.input.emachine.type,
    mechanism,
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
