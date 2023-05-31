import { EMachineComponentModel } from "./emachine-component";

export type ComponentParam<T = any> = {
  label: React.ReactNode;
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
  const result = [EMachineComponentModel].find((m) => m.kind == kind);
  if (!result) {
    throw new Error("Component is not found: " + kind);
  }

  return result;
}
