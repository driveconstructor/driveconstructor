import { CableComponent, CableComponentModel } from "./cable-component";
import {
  EMachineComponent,
  EMachineComponentModel,
} from "./emachine-component";

export type ComponentParam<T = any> = {
  label: React.ReactNode;
  advanced?: boolean;
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
  const result = [EMachineComponentModel, CableComponentModel].find((m) => m.kind == kind);
  if (!result) {
    throw new Error("Component is not found: " + kind);
  }

  return result;
}

export type Components = {
  emachine: EMachineComponent[];
  cable: CableComponent[]
};
