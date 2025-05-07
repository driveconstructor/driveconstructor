import { ComponentModel } from "./component";
import {
  DepthParam,
  DesignationParam,
  HeightParam,
  LengthParam,
  PriceParam,
  WeightParam,
  WidthParam,
} from "./component-params";
import { EMachineProtectionType, FcCoolingType } from "./cooling-protection";
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
  cooling: FcCoolingType;
  protection: EMachineProtectionType;
};

export const TrafoComponentModel: ComponentModel<TrafoComponent> = {
  kind: "trafo",
  title: "Trafo",
  params: {
    voltageLVmax: { label: "voltageLVmax" },
    voltageHVmax: { label: "voltageHVmax" },
    currentHVmax: { label: "currentHVmax" },
    currentLVmax: { label: "currentLVmax" },
    efficiency100: { label: "efficiency100" },
    ratedCoolantTemperature: { label: "ratedCoolantTemperature" },
    ratedPower: { label: "ratedPower" },
    typeII: { label: "typeII" },
    typeIII: { label: "typeIII" },
    typeIV: { label: "typeIV" },
    cooling: { label: "cooling" },
    protection: { label: "protection" },
    ...WeightParam,
    ...LengthParam,
    ...HeightParam,
    ...WidthParam,
    ...PriceParam,
    ...DepthParam,
    ...DesignationParam,
  },
};
