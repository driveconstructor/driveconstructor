import { ComponentParam, getComponentModel } from "@/model/component";
import { useContext } from "react";
import { SystemContext } from "./Input";

export default function Candidates() {
  const context = useContext(SystemContext);
  return (
    <div className="break-all">
      {Object.entries(context.system.candidates).map(([k, v]) =>
        (v as []).map((v, i) => (
          <div key={i}>
            <Candidate kind={k} value={v} />
          </div>
        ))
      )}
    </div>
  );
}

function Candidate({ kind, value }: { kind: string; value: any }) {
  const model = getComponentModel(kind);
  return (
    <div>
      <div className="text-lg text-gray-500">{model.title}</div>
      <div className="grid grid-cols-4 md:grid-cols-8">
        {Object.keys(model.params).map((k, i) => (
          <div key={i}>
            <Param param={model.params[k]} value={value[k]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Param({ param, value }: { param: ComponentParam; value: any }) {
  return (
    <div className="p-1">
      <div className="text-sm">{param.label}:</div>
      <div className="border">{param.render ? param.render(value) : value}</div>
    </div>
  );
}
