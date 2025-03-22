import { CableComponent, CableComponentModel } from "./cable-component";
import {
  EMachineComponent,
  EMachineComponentModel,
} from "./emachine-component";
import {
  FConvertorComponent,
  FConvertorComponentModel,
} from "./fconvertor-component";

export type ComponentParam<T = any> = {
  label: React.ReactNode;
  advanced?: boolean;
  precision?: number;
  render?: (value: T) => React.ReactNode;
};

export type ComponentModel<T = any> = {
  kind: string;
  title: React.ReactNode;
  params: {
    [P in keyof T]: ComponentParam<T[P]>;
  };
};

export function getComponentModel(kind: string): ComponentModel {
  const result = [
    EMachineComponentModel,
    CableComponentModel,
    FConvertorComponentModel,
  ].find((m) => m.kind == kind);
  if (!result) {
    throw new Error("Component is not found: " + kind);
  }

  return result;
}

export type BaseComponents = {
  emachine?: EMachineComponent;
  cable?: CableComponent;
  fconvertor?: FConvertorComponent;
};

export type BaseCandidates = {
  [P in keyof BaseComponents]: BaseComponents[P][];
};
