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

export function createSystem(model: SystemModel): string {
  const kind = model.kind;
  const input = Object.entries(model.input).reduce((a, [e, p]) => {
    return {
      ...a,
      [e]: Object.entries(p.params).reduce((b, [k, v]) => {
        return { ...b, [k]: v.value };
      }, {}),
    };
  }, {});

  const id = "draft_" + kind;
  const system = {
    kind,
    input,
    element: Object.keys(model.input)[0],
  } as System;
  saveSystem(id, withCandidates(system));
  return id;
}

export function updateSystem(
  context: SystemContextType,
  paramName: string,
  value: any
): System {
  const updated: System = {
    ...context.system,
    input: {
      ...context.system.input,
      [context.system.element]: {
        ...context.system.input[context.system.element],
        [paramName]: value,
      },
    },
  } as System;

  const updateSystem =
    context.model.input[context.system.element].params[paramName].updateSystem;

  return withCandidates(updateSystem ? updateSystem(updated, value) : updated);
}

function withCandidates(system: System): System {
  return {
    ...system,
    candidates: findCandidates(system),
  };
}
