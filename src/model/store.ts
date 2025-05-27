import { withCandidates } from "./sizing";
import { System, SystemModel } from "./system";

const prefix = "dc-v1.system.";
const draft_prefix = "draft_";

export function getSystem(id: string): System {
  const json = localStorage.getItem(prefix + id);
  if (!json) {
    throw new Error("System is not found: " + id);
  }

  return JSON.parse(json);
}

export function saveSystem(system: System): void {
  localStorage.setItem(prefix + system.id, JSON.stringify(system));
}

export type SystemContextType = {
  model: SystemModel;
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

export function createSystem(model: SystemModel): System {
  const kind = model.kind;
  const input = updateSystemInput(model, initSystemInput(model));

  const id = draft_prefix + kind;
  const result = {
    id,
    kind,
    input,
    element: Object.keys(model.input)[0],
    name: "Unsaved draft",
  } as System;
  const system = withCandidates(model.update?.(result) ?? result);
  saveSystem(system);
  return system;
}

export function updateParam(
  model: SystemModel,
  system: System,
  paramName: string,
  value: any,
): System {
  const withParamValue: System = {
    ...system,
    input: {
      ...system.input,
      [system.element]: {
        ...system.input[system.element],
        [paramName]: value,
      },
    },
  } as System;

  const withParamUpdate =
    model.input[system.element].params[paramName].update?.(
      withParamValue,
      value,
    ) ?? withParamValue;
  const withModelUpdate = model.update?.(withParamUpdate) ?? withParamUpdate;

  const input = updateSystemInput(model, withModelUpdate.input);
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

export function createNamedSystem(oldId: string, name: string): System {
  const system = getSystem(oldId);
  const id = generateSystemId();
  const updated = { ...system, id, name };
  return updated;
}

function generateSystemId() {
  return window.crypto.randomUUID().replaceAll("-", "").substring(0, 7);
}

export function getSystems(): System[] {
  return typeof localStorage == "undefined"
    ? []
    : Object.keys(localStorage)
        .filter((k) => k.startsWith(prefix))
        .map((k) => getSystem(k.substring(prefix.length)))
        .filter((v) => !isDraft(v));
}

export function deleteSystem(id: string) {
  localStorage.removeItem(prefix + id);
}

export function isDraft(system: System) {
  return system.id == null || system.id.startsWith(draft_prefix);
}

export function duplicateSystem(id: string, name: string): System {
  const system = getSystem(id);
  const newId = generateSystemId();
  const newSystem = { ...system, id: newId, name };
  saveSystem(newSystem);
  return newSystem;
}
