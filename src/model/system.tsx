import { StaticImageData } from "next/image";
import React from "react";
import dfimCableIcon from "../images/el-cable-dfim.svg";
import dfimFConverter2LIcon from "../images/el-fconverter-2L-dfim.svg";
import dfimFConverter3LIcon from "../images/el-fconverter-3L-dfim.svg";
import dfimFConverterML2QIcon from "../images/el-fconverter-ML-2Q-dfim.svg";
import dfimFConverterML4QIcon from "../images/el-fconverter-ML-4Q-dfim.svg";
import applications from "./application";
import { Cable } from "./cable";
import {
  ConveyorFc,
  ConveyorFcTr,
  ConveyorGbFc,
  ConveyorGbFcTr,
} from "./conveyor-system";
import { EMachine } from "./emachine";
import { FConverter, LowVoltageType } from "./fconverter";
import { Grid } from "./grid";
import { PumpFc, PumpFcTr, PumpGbFc, PumpGbFcTr } from "./pump-system";
import { SystemParamsType } from "./system-params";
import { WinchFc, WinchFcTr, WinchGbFc, WinchGbFcTr } from "./winch-system";
import { WindFc, WindFcTr, WindGbFc, WindGbFcTr } from "./wind-system";

export type ParamType = "text" | "number";

export type ParamRangeProps<V> = { min: V; max: V; step?: V };

export type SystemParam<V = any, E = any> = {
  label: React.ReactNode;
  type: ParamType;
  value: V | ((element: E, input: System["input"]) => number);
  options?: V[] | (string | null)[];
  optionLabels?: (React.ReactNode | null)[];
  range?: ParamRangeProps<V>;
  advanced?: true;
  hidden?: boolean;
  disabled?: boolean;
  precision?: number;
  update?: (system: System, value: V) => System;
};

export type SystemElement<T = any> = {
  icon: StaticImageData;
  iconScale?: number; // defaults to 1
  customize?: (model: SystemElement<T>, value: T) => SystemElement<T>;
  params: {
    [P in keyof T]: SystemParam<T[P], T>;
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
  update?: (system: T) => T;
};

export type SystemModel = Model<any>;

const models = applications.flatMap((a) => a.systems);

export type BaseSystem = {
  id: string;
  element: string;
  input: {
    emachine: EMachine;
    cable: Cable;
    fconverter: FConverter;
    switch: {};
    grid: Grid;
  };
  params: SystemParamsType | null;
  name: string;
  timeUpdated: number;
};

export type System = (
  | PumpFc
  | PumpGbFc
  | PumpFcTr
  | PumpGbFcTr
  | WinchFc
  | WindFc
  | WinchGbFc
  | WinchFcTr
  | WinchGbFcTr
  | WindGbFc
  | WindFcTr
  | WindGbFcTr
  | ConveyorFc
  | ConveyorGbFc
  | ConveyorFcTr
  | ConveyorGbFcTr
) & {
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

  return customizeSystemModel({ ...model, input }, value.input);
}

// TODO: introduce a model public method
// customize the model of an element based on input
function customizeSystemModel(
  model: SystemModel,
  input: System["input"],
): SystemModel {
  if (input.emachine.type == "SyRM") {
    return {
      ...model,
      input: {
        ...model.input,
        fconverter: {
          ...model.input.fconverter,
          params: {
            ...model.input.fconverter.params,
            type: {
              ...model.input.fconverter.params.type,
              options: LowVoltageType,
            },
          },
        },
      },
    };
  }

  if (input.emachine.type == "DFIM") {
    if (input.fconverter.type == "4Q-3L-NPC-VSC") {
      return {
        ...model,
        input: {
          ...model.input,
          fconverter: {
            ...model.input.fconverter,
            icon: dfimFConverter3LIcon, // ← Change icon
          },
          cable: {
            ...model.input.cable,
            icon: dfimCableIcon, // ← Change icon
          },
        },
      };
    } else if (input.fconverter.type == "4Q-ML-SCHB-VSC") {
      return {
        ...model,
        input: {
          ...model.input,
          fconverter: {
            ...model.input.fconverter,
            icon: dfimFConverterML4QIcon, // ← Change icon
          },
          cable: {
            ...model.input.cable,
            icon: dfimCableIcon, // ← Change icon
          },
        },
      };
    } else if (input.fconverter.type == "2Q-ML-SCHB-VSC") {
      return {
        ...model,
        input: {
          ...model.input,
          fconverter: {
            ...model.input.fconverter,
            icon: dfimFConverterML2QIcon, // ← Change icon
          },
          cable: {
            ...model.input.cable,
            icon: dfimCableIcon, // ← Change icon
          },
        },
      };
    }
    return {
      ...model,
      input: {
        ...model.input,
        fconverter: {
          ...model.input.fconverter,
          icon: dfimFConverter2LIcon, // ← Change icon
        },
        cable: {
          ...model.input.cable,
          icon: dfimCableIcon, // ← Change icon
        },
      },
    };
  }
  return model;
}
