import { CoolingProtection } from "./cooling-protection";
import {
  PowerTypeAlias,
  TypeIIAlias,
  TypeIIIAlias,
  TypeIVAlias,
} from "./trafo";

export type TrafoComponent = {
  designation: string;
  weight: number;
  depth: number;
  height: number;
  width: number;
  price: number;
  voltageLVmax: number;
  voltageHVmax: number;
  currentHVmax: number;
  currentLVmax: number;
  efficiency100: number;
  ratedCoolantTemperature: number;
  ratedPower: PowerTypeAlias;
  typeII: TypeIIAlias;
  typeIII: TypeIIIAlias;
  typeIV: TypeIVAlias;
} & CoolingProtection;
