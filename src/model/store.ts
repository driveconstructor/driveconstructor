import { withCandidates } from "./sizing";
import { System, SystemModel } from "./system";

const prefix = "dc-v1.system.";

export function getSystem(id: string): System {
  const json = localStorage.getItem(prefix + id);
  if (!json) {
    throw new Error("System is not found: " + id);
  }

  return JSON.parse(json);
}

export function saveSystem(id: string, system: System): void {
  localStorage.setItem(prefix + id, JSON.stringify(system));
}

export type SystemContextType = {
  model: SystemModel;
  id: string;
  system: System;
};

export function updateSystemInput(
  model: SystemModel,
  input: Record<string, any>,
) {
  // update functional values
  return Object.entries(model.input).reduce((a, [e, p]) => {
    return {
      ...a,
      [e]: Object.entries(p.params).reduce((b, [k, v]) => {
        return {
          ...b,
          [k]: typeof v.value == "function" ? v.value(b, input) : input[e][k],
        };
      }, {}),
    };
  }, {});
}

export function initSystemInput(model: SystemModel) {
  // initialize with default values
  return Object.entries(model.input).reduce((a, [e, p]) => {
    return {
      ...a,
      [e]: Object.entries(p.params).reduce((b, [k, v]) => {
        return {
          ...b,
          [k]: v.value,
        };
      }, {}),
    };
  }, {});
}

export function createSystem(model: SystemModel): {
  id: string;
  system: System;
} {
  const kind = model.kind;
  const input = updateSystemInput(model, initSystemInput(model));

  const id = "draft_" + kind;
  const result = {
    kind,
    input,
    element: Object.keys(model.input)[0],
  } as System;
  const system = withCandidates(model.update?.(result) ?? result);
  saveSystem(id, system);
  return { id, system };
}

export function updateParam(
  context: SystemContextType,
  paramName: string,
  value: any,
): System {
  const withParamValue: System = {
    ...context.system,
    input: {
      ...context.system.input,
      [context.system.element]: {
        ...context.system.input[context.system.element],
        [paramName]: value,
      },
    },
  } as System;

  const withParamUpdate =
    context.model.input[context.system.element].params[paramName].update?.(
      withParamValue,
      value,
    ) ?? withParamValue;
  const withModelUpdate =
    context.model.update?.(withParamUpdate) ?? withParamUpdate;

  const input = updateSystemInput(context.model, withModelUpdate.input);
  const withCalculatedParams = {
    ...withModelUpdate,
    input,
  } as any;

  const withoutComponents = {
    ...withCalculatedParams,
    candidates: {},
    components: {},
  };

  return withCandidates(withoutComponents);
}
