import { FConverterTypeAlias } from "./fconverter";
import { FConverterComponent } from "./fconverter-component";

function lowVoltage(fc: FConverterComponent) {
  if (fc.mounting == "wall" && fc.ratedPower > 250) {
    return false;
  }

  if (fc.mounting == "floor" && fc.ratedPower < 200) {
    return false;
  }

  if (fc.voltage.type == "LV" && fc.ratedPower <= 2000) {
    return true;
  }

  return false;
}

function mediumVoltage1(fc: FConverterComponent) {
  if (fc.mounting == "wall") {
    return false;
  }

  if (
    fc.voltage.type == "MV1" &&
    fc.ratedPower >= 200 &&
    fc.ratedPower <= 5800
  ) {
    return true;
  }

  return false;
}

function mediumVoltage2(fc: FConverterComponent) {
  if (fc.mounting == "wall") {
    return false;
  }

  if (
    fc.voltage.type == "MV1" &&
    fc.voltage.value <= 6000 &&
    fc.ratedPower >= 200 &&
    fc.ratedPower <= 5800
  ) {
    return true;
  }

  if (
    fc.voltage.type == "MV2" &&
    fc.voltage.value > 6000 &&
    fc.ratedPower >= 200 &&
    fc.ratedPower <= 13700
  ) {
    return true;
  }

  return false;
}

export const FConverterVoltageFilering: Record<
  FConverterTypeAlias,
  (fc: FConverterComponent) => boolean
> = {
  "2Q-2L-VSC-6p": lowVoltage,
  "2Q-2L-VSC-12p": lowVoltage,
  "4Q-2L-VSC": lowVoltage,
  "2Q-3L-NPC-VSC": mediumVoltage1,
  "4Q-3L-NPC-VSC": mediumVoltage1,
  "2Q-ML-SCHB-VSC": mediumVoltage2,
  "4Q-ML-SCHB-VSC": mediumVoltage2,
};
