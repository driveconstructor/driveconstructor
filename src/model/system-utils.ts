import { OverrideFunction } from "./store";
import { System, SystemModel } from "./system";

type ValuePath = [string, string, any];

export function packValues(model: SystemModel, system: System): string {
  const values = Object.entries(model.input).flatMap(([e, ee]) =>
    Object.entries(ee.params)
      .filter(
        ([p, v]) =>
          typeof v.value != "function" && v.value != system.input[e][p],
      )
      .map(([p, _]) => {
        return [e, p, system.input[e][p]] as ValuePath;
      }),
  );

  // {cable: 1}

  return encodeURIComponent(JSON.stringify(values));
}

export function unpackValues(json: string): OverrideFunction {
  const values: ValuePath[] = JSON.parse(json);

  const object = values.reduce((o, [e, p, v]) => {
    return { ...o, [e]: { ...o[e], [p]: v } };
  }, {} as any);

  console.log("Unpacked values: " + JSON.stringify(2, null, object));

  return (e, p, v) => {
    if (typeof object[e] == "undefined") {
      return v;
    }
    const newValue = object[e][p];
    return typeof newValue == "undefined" ? v : newValue;
  };
}
