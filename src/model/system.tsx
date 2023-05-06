import React, { HTMLInputTypeAttribute } from "react";
import { PumpFcModel } from "./pump-fc";
import { WinchFcModel } from "./winch-fc";

export type SystemParam<V = any> = {
  type: HTMLInputTypeAttribute;
  value: V;
  options?: readonly V[];
};

export type SystemElement<T = any> = {
  icon: StaticImageData;
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

import { StaticImageData } from "next/image";
import { PumpFc } from "./pump-fc";
import { WinchFc } from "./winch-fc";

export type System = (PumpFc | WinchFc) & {
  input: Record<string, Record<string, any>>;
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
