import { ComponentParam, getComponentModel } from "@/model/component";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { SystemContext } from "./Input";
import { round } from "@/model/utils";

export default function Candidates({
  onSelect,
}: {
  onSelect: (k: string, v: any) => void;
}) {
  const context = useContext(SystemContext);
  return (
    <div className="break-all">
      {Object.entries(context.system.candidates).map(([k, v]) => {
        const selected = v.findIndex(
          (c) =>
            c?.designation ==
            (context.system.components as any)[k]?.designation,
        );
        return (
          <div key={k}>
            <Candidate
              kind={k}
              values={v}
              selected={selected}
              setSelected={(i) => onSelect(k, v[i])}
            />
          </div>
        );
      })}
    </div>
  );
}

function Candidate({
  kind,
  values,
  selected,
  setSelected,
}: {
  kind: string;
  values: any[];
  selected: number;
  setSelected: (i: number) => void;
}) {
  const model = getComponentModel(kind);
  const hasAdvanced = Boolean(
    Object.entries(model.params).find(([_, v]) => v.advanced)?.length,
  );
  const [showMore, setShowMore] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="flex p-2">
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex flex-nowrap hover:cursor-pointer"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-6 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-6 text-gray-500" />
          )}
          <div className="text-lg text-gray-500">
            {model.title + (collapsed ? `(${values.length})` : "")}
          </div>
        </div>
        {!collapsed && hasAdvanced && values.length != 0 ? (
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
        {values
          .filter(() => !collapsed)
          .map((v, i) => (
            <div
              key={i}
              className={
                selected == i
                  ? "border border-blue-400 bg-slate-50"
                  : "border hover:border-blue-400"
              }
              onClick={() => setSelected(i)}
            >
              <div className="grid grid-cols-4 lg:grid-cols-8">
                <div className="justify-self-center">
                  Selected{" "}
                  <input
                    type="radio"
                    checked={selected == i}
                    onChange={() => setSelected(i)}
                  />
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

function Param({ param: model, value }: { param: ComponentParam; value: any }) {
  return (
    <div className="p-1">
      <div className="text-sm">{model.label}:</div>
      <div className="border">
        {model.render
          ? model.render(value)
          : typeof value == "number"
            ? round(value, model.precision)
            : value}
      </div>
    </div>
  );
}

/**
 *     <div className="p-4">
      <div className="absolute mx-2 p-2 text-xs">{param.label}:</div>
      <div className="m-4 border p-2">
        {param.render ? param.render(value) : value}
      </div>
    </div>
 */
