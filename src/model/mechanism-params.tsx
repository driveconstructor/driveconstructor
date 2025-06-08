import { Conveyor } from "./conveyor";
import { SystemParam } from "./system";
import { Winch } from "./winch";

type ParamType = Omit<SystemParam, "value">;

export const PowerOnShaftParam: ParamType = {
  label: "Power on shaft, kW",
  type: "number",
  precision: 1,
};

export const MinimalSpeedParam: ParamType = {
  label: "Minimal speed, rpm",
  type: "number",
};

export const TorqueOverloadParam: ParamType = {
  label: "Torque overload, kNm",
  type: "number",
  precision: 1,
};

export const DutyCorrectionParam: SystemParam = {
  label: "Duty correction",
  type: "number",
  precision: 2,
  value: dutyCorrection,
};

export const RatedSpeedParam: ParamType = {
  label: "Rated speed, rpm",
  type: "number",
};

export function dutyCorrection(mechanism: Winch | Conveyor) {
  const emWeight =
    3000 *
    Math.pow(
      (mechanism.ratedTorque * mechanism.ratedSpeed) / 9.55 / 1000,
      0.8,
    ) *
    Math.pow(400 / Math.pow(1000, 0.9) + 1, 1.43);

  const emThermalConstant = 0.15 * Math.pow(Math.log10(emWeight + 1), 1.5);

  const K = ((mechanism.dutyCyclePeriod / 60) * mechanism.duty) / 100;

  if (emThermalConstant <= 0.5 * K) {
    return 1;
  }

  if (emThermalConstant >= 2 * K) {
    return mechanism.duty / 100;
  }

  return (
    (emThermalConstant / ((1.5 * mechanism.duty) / 100) - 1 / 3) *
      (1 - mechanism.duty / 100) +
    mechanism.duty / 100
  );
}

export function getCurrentK(mechanism: Winch | Conveyor) {
  if (mechanism.overloadAmplitude > 50) {
    if (
      mechanism.overloadDuration <= 2 &&
      mechanism.overloadCyclePeriod >= 60
    ) {
      return 1;
    }

    if (mechanism.overloadDuration > 2 && mechanism.overloadCyclePeriod < 60) {
      return 1 + mechanism.overloadAmplitude / 130;
    }

    return 1 + mechanism.overloadAmplitude / 200;
  } else {
    if (
      mechanism.overloadDuration <= 60 &&
      mechanism.overloadCyclePeriod >= 600
    ) {
      return 1;
    }

    if (
      mechanism.overloadDuration > 60 &&
      mechanism.overloadCyclePeriod < 600
    ) {
      return 1 + mechanism.overloadAmplitude / 100;
    }

    return 1 + mechanism.overloadAmplitude / 150;
  }
}
