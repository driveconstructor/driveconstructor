import { ComponentModel } from "./component";
import {
  DepthParam,
  DesignationParam,
  HeightParam,
  PriceParam,
  WeightParam,
  WidthParam,
} from "./component-params";
import {
  CoolingParam,
  EMachineProtectionType,
  FcCoolingType,
  ProtectionParam,
} from "./cooling-protection";
import { EfficiencyParam } from "./efficiency-component";
import {
  PowerTypeAlias,
  TrafoElement,
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
  footprint: number;
  volume: number;
  efficiency75?: number;
  efficiency50?: number;
  efficiency25?: number;
};

export const TrafoComponentModel: ComponentModel<TrafoComponent> = {
  kind: "trafo",
  title: "Trafo",
  params: {
    voltageLVmax: {
      label: "LV side voltage (max)",
      precision: 2,
    },
    voltageHVmax: {
      label: "HV side voltage (max)",
      precision: 2,
    },
    currentHVmax: {
      label: "HV side current (max)",
      precision: 2,
    },
    currentLVmax: {
      label: "LV side current (max)",
      precision: 2,
    },
    ...EfficiencyParam,
    ratedCoolantTemperature: {
      label: null,
      hidden: true,
    },
    ratedPower: {
      label: TrafoElement.params.ratedPower.label,
    },
    typeII: {
      label: TrafoElement.params.typeII.label,
    },
    typeIII: {
      label: TrafoElement.params.typeIII.label,
    },
    typeIV: {
      label: TrafoElement.params.typeIV.label,
    },
    ...CoolingParam,
    ...ProtectionParam,
    ...WeightParam,
    ...HeightParam,
    ...WidthParam,
    ...PriceParam,
    ...DepthParam,
    ...DesignationParam,
    footprint: {
      label: null,
      hidden: true,
    },
    volume: {
      label: null,
      hidden: true,
    },
  },
};
