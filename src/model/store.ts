import { BaseComponents } from "./component";
import { findCandidates } from "./sizing";
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

export function initOrUpdateSystemInput(
  model: SystemModel,
  input?: Record<string, any>,
) {
  return Object.entries(model.input).reduce((a, [e, p]) => {
    return {
      ...a,
      [e]: Object.entries(p.params).reduce((b, [k, v]) => {
        return {
          ...b,
          [k]:
            typeof v.value == "function"
              ? v.value(b)
              : input
                ? input[e][k]
                : v.value,
        };
      }, {}),
    };
  }, {});
}

export function createSystem(model: SystemModel): string {
  const kind = model.kind;
  const input = initOrUpdateSystemInput(model);

  const id = "draft_" + kind;
  const system = {
    kind,
    input,
    element: Object.keys(model.input)[0],
  } as System;
  saveSystem(id, withCandidates(model.update?.(system) ?? system));
  return id;
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

  const input = initOrUpdateSystemInput(context.model, withModelUpdate.input);
  const withCalculatedParams = {
    ...withModelUpdate,
    input,
  } as any;

  const withoutComponents = { ...withCalculatedParams, components: {} };

  return withCandidates(withoutComponents);
}

function withCandidates(system: System): System {
  const candidates = findCandidates(system);
  const components = Object.entries(candidates)
    .filter(([_, candidate]) => candidate.length == 1)
    .reduce(
      (a, [name, candidate]) => {
        return {
          ...a,
          [name]: candidate[0],
        };
      },
      { ...system.components },
    );
  return {
    ...system,
    candidates,
    components,
  };
}
