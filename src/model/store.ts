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
  element: string;
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
  saveSystem(id, { kind, input } as System);
  return id;
}

export function updateSystem(
  context: SystemContextType,
  paramName: string,
  value: any
): System {
  return {
    ...context.system,
    input: {
      ...context.system.input,
      [context.element]: {
        ...context.system.input[context.element],
        [paramName]: value,
      },
    },
  } as System;
}
