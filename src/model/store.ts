import { withCandidates } from "./sizing";
import { customizeModel, getModel, System, SystemModel } from "./system";

const prefix = "dc-v1.system.";
const draft_prefix = "draft_";

export function getSystem(id: string): System {
  const json = localStorage.getItem(prefix + id);
  if (!json) {
    throw new Error("System is not found: " + id);
  }

  return JSON.parse(json);
}

export function updateSystem(system: System): System {
  return { ...system, timeUpdated: Date.now() };
}

export function saveSystem(system: System) {
  localStorage.setItem(prefix + system.id, JSON.stringify(system));
}

export function saveSystems(systems: System[]) {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.substring(prefix.length))
    .filter((id) => !id.startsWith(draft_prefix))
    // delete non-matching
    .filter((id) => !systems.map((s) => s.id).includes(id))
    .forEach(deleteSystem);
  systems.forEach(saveSystem);
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

export type OverrideFunction = (e: string, p: string, v: any) => any;

function initSystemInput(model: SystemModel, override?: OverrideFunction) {
  // initialize with default values
  return Object.entries(model.input).reduce((a, [e, p]) => {
    return {
      ...a,
      [e]: Object.entries(p.params).reduce((b, [k, v]) => {
        return {
          ...b,
          [k]:
            typeof override == "undefined" ? v.value : override(e, k, v.value),
        };
      }, {}),
    };
  }, {});
}

export function reconcileOptions(model: SystemModel, system: System): System {
  let input = system.input;

  for (const [elementName, elementModel] of Object.entries(model.input)) {
    const elementInput = input[elementName];
    if (elementInput == null) {
      continue;
    }

    let updatedElementInput = elementInput;
    for (const [paramName, paramModel] of Object.entries(elementModel.params)) {
      const options = paramModel.options;
      if (
        options == null ||
        options.length == 0 ||
        options.includes(elementInput[paramName])
      ) {
        continue;
      }

      if (updatedElementInput === elementInput) {
        updatedElementInput = { ...elementInput };
      }
      updatedElementInput[paramName] = options[0];
    }

    if (updatedElementInput !== elementInput) {
      if (input === system.input) {
        input = { ...system.input };
      }
      input[elementName] = updatedElementInput;
    }
  }

  return input === system.input ? system : ({ ...system, input } as System);
}

function reconcileCustomizedOptions(
  baseModel: SystemModel,
  initialSystem: System,
): System {
  let system = initialSystem;

  for (let pass = 0; pass < 10; pass++) {
    const reconciled = reconcileOptions(
      customizeModel(baseModel, system),
      system,
    );
    if (reconciled === system) {
      return system;
    }
    system = reconciled;
  }

  throw new Error("Input option reconciliation did not stabilize");
}

export function createSystem(
  model: SystemModel,
  override?: OverrideFunction,
): System {
  const baseModel = getModel(model.kind);
  const kind = baseModel.kind;
  const input = updateSystemInput(
    baseModel,
    initSystemInput(baseModel, override),
  );

  const id = draft_prefix + kind;
  const result = {
    id,
    kind,
    input,
    element: Object.keys(baseModel.input)[0],
    name: "Unsaved draft",
  } as System;
  const updated = baseModel.update?.(result) ?? result;
  const reconciled = reconcileCustomizedOptions(baseModel, updated);
  const inputWithCalculatedParams = updateSystemInput(
    customizeModel(baseModel, reconciled),
    reconciled.input,
  );
  const system = withCandidates({
    ...reconciled,
    input: inputWithCalculatedParams,
  } as System);
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

  const baseModel = getModel(system.kind);
  const reconciled = reconcileCustomizedOptions(baseModel, withModelUpdate);
  const input = updateSystemInput(
    customizeModel(baseModel, reconciled),
    reconciled.input,
  );
  const withCalculatedParams = {
    ...reconciled,
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
  return updateSystem({ ...system, id: newId, name });
}
