import { StaticImageData } from "next/image";
import React from "react";
import { PumpFc, PumpFcModel } from "./pump-fc";
import { WinchFc, WinchFcModel } from "./winch-fc";

export type ParamType = "text" | "number";

export type ParamRangeProps<V> = { min: V; max: V; step?: V };

export type SystemParam<V = any> = {
  label: React.ReactNode;
  type: ParamType;
  value: V;
  options?: V[] | string[];
  range?: ParamRangeProps<V>;
  advanced?: true;
};

export type SystemElement<T = any> = {
  icon: StaticImageData;
  customize?: (model: SystemElement<T>, value: T) => SystemElement<T>;
  params: {
    [P in keyof T]: SystemParam<T[P]>;
  };
};

export type Model<T extends System> = {
  kind: T["kind"];
  title: React.ReactNode;
  description: React.ReactNode;
  input: {
    [E in keyof T["input"]]: SystemElement<T["input"][E]>;
  };

  findCandidates: (system: T) => string;
};

export type SystemModel = Model<any>;

const models: Record<SystemKind, SystemModel> = {
  "pump-fc": PumpFcModel,
  "winch-fc": WinchFcModel,
};

export type System = (PumpFc | WinchFc) & {
  input: Record<string, Record<string, any>>;
  showMore?: boolean;
};

export type SystemKind = System["kind"];

export function getModel(kind: SystemKind): SystemModel {
  const result = models[kind];
  if (result != null) {
    return result;
  }

  throw new Error(`unknown system kind: ${kind}`);
}

export function getSystemKindsWithlements() {
  return Object.entries(models).flatMap(([_, model]) =>
    Object.keys(model.input).map((k) => {
      return { kind: model.kind, element: k };
    })
  );
}

export function customizeModel<T extends System>(
  model: SystemModel,
  system: T
): SystemModel {
  const input = Object.entries(model.input).reduce((o, [k, v]) => {
    const customized = v.customize
      ? v.customize(model.input[k], system.input[k])
      : model.input[k];
    return { ...o, [k]: customized };
  }, {});

  return { ...model, input };
}
