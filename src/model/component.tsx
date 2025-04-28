import { CableComponent, CableComponentModel } from "./cable-component";
import {
  EMachineComponent,
  EMachineComponentModel,
} from "./emachine-component";
import {
  FConverterComponent,
  FConverterComponentModel,
} from "./fconverter-component";
import { GearboxComponent, GearboxComponentModel } from "./gearbox-component";

export type ComponentParam<T = any> = {
  label: React.ReactNode;
  advanced?: boolean;
  precision?: number;
  hidden?: boolean;
  render?: (value: T) => React.ReactNode;
};

export type ComponentModel<T = any> = {
  kind: string;
  title: React.ReactNode;
  params: { [P in keyof T]: ComponentParam<T[P]> };
  customize?: (model: ComponentModel<T>, component: T) => ComponentModel<T>;
};

export function getComponentModel(kind: string): ComponentModel {
  const result = [
    GearboxComponentModel,
    EMachineComponentModel,
    CableComponentModel,
    FConverterComponentModel,
  ].find((m) => m.kind == kind);
  if (!result) {
    throw new Error("Component is not found: " + kind);
  }

  return result;
}

export type ComponentsType = {
  emachine?: EMachineComponent;
  cable?: CableComponent;
  fconverter?: FConverterComponent;
  gearbox?: GearboxComponent;
};

export type CandidatesType = {
  [P in keyof ComponentsType]: ComponentsType[P][];
};
