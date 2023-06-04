import { ComponentParam, getComponentModel } from "@/model/component";
import { useContext, useState } from "react";
import { SystemContext } from "./Input";

export default function Candidates() {
  const context = useContext(SystemContext);
  return (
    <div className="break-all">
      {Object.entries(context.system.candidates).map(([k, v]) => (
        <div key={k}>
          <Candidate kind={k} values={v} />
        </div>
      ))}
    </div>
  );
}

function Candidate({ kind, values }: { kind: string; values: any[] }) {
  console.log(values);
  const model = getComponentModel(kind);
  const hasAdvanced = Boolean(
    Object.entries(model.params).find(([k, v]) => v.advanced)?.length
  );
  const [showMore, setShowMore] = useState(false);
  const [selected, setSelected] = useState(values.length == 1 ? 0 : -1);

  return (
    <>
      <div className="flex p-2">
        <div className="text-lg text-gray-500">{model.title}</div>
        {hasAdvanced ? (
          <>
            <div className="grow" />
            <div
              className="btn flex-none"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Less..." : "More..."}
            </div>
          </>
        ) : null}
      </div>
      <div>
        {values.map((v, i) => (
          <div
            key={i}
            className={
              selected == i
                ? "border border-blue-400 bg-slate-50"
                : "border hover:border-blue-400"
            }
            onClick={() => setSelected(i)}
          >
            <div className="grid grid-cols-4 md:grid-cols-8">
              <div className="justify-self-center">
                Selected <input type="radio" checked={selected == i} />
              </div>
              {Object.keys(model.params)
                .filter((k) => showMore || !model.params[k].advanced)
                .map((k, i) => (
                  <div key={i}>
                    <Param param={model.params[k]} value={v[k]} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
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
