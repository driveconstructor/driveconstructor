import { StaticImageData } from "next/image";
import React from "react";
import applications from "./application";
import { Cable } from "./cable";
import { EMachine } from "./emachine";
import { FConvertor } from "./fconvertor";
import { Grid } from "./grid";
import { PumpFc, PumpFcTr, PumpGbFc } from "./pump-system";
import { WinchFc } from "./winch-system";

export type ParamType = "text" | "number";

export type ParamRangeProps<V> = { min: V; max: V; step?: V };

export type SystemParam<V = any> = {
  label: React.ReactNode;
  type: ParamType;
  value: V;
  options?: V[] | (string | null)[];
  optionLabels?: (React.ReactNode | null)[];
  range?: ParamRangeProps<V>;
  advanced?: true;
  hidden?: boolean;
  disabled?: boolean;
  postUpdate?: (system: System, value: V) => System;
};

export type SystemElement<T = any> = {
  icon: StaticImageData;
  iconWidth?: number;
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

  validate?: (system: T) => string[];
  postUpdate?: (system: T) => T;
};

export type SystemModel = Model<any>;

const models = applications.flatMap((a) => a.systems);

export type BaseSystem = {
  element: string;
  input: {
    emachine: EMachine;
    cable: Cable;
    fconvertor: FConvertor;
    switch: {};
    grid: Grid;
  };
};

export type System = (PumpFc | PumpGbFc | PumpFcTr | WinchFc) & {
  // to make type script access different types for systems
  input: Record<string, Record<string, any>>;
};

export type SystemKind = System["kind"];

export function getModel(kind: SystemKind): SystemModel {
  const result = models.find((m) => m.kind == kind);
  if (result != null) {
    return result;
  }

  throw new Error(`unknown system kind: ${kind}`);
}

export function getSystemKinds() {
  return models.map((m) => {
    return { kind: m.kind };
  });
}

export function customizeModel<T extends System>(
  model: SystemModel,
  value: T,
): SystemModel {
  const input = Object.entries(model.input).reduce((o, [k, v]) => {
    const customized = v.customize
      ? v.customize(model.input[k], value.input[k])
      : model.input[k];
    return { ...o, [k]: customized };
  }, {});

  return { ...model, input };
}
