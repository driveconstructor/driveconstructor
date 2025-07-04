import {
  ComponentParam,
  customizeModel,
  getComponentModel,
  renderComponentParam,
} from "@/model/component";
import { findColorEntry } from "@/model/emachine-utils";
import { System } from "@/model/system";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { SystemContext } from "./System";

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
              system={context.system}
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
  system,
  kind,
  values,
  selected,
  setSelected,
}: {
  system: System;
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
          className="flex flex-nowrap cursor-pointer"
        >
          {collapsed ? (
            <ChevronRightIcon className="h-6 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-6 text-gray-500" />
          )}
          <div className="text-lg text-gray-500">
            {`${model.title} (${values.length})`}
          </div>
        </div>
        {!collapsed && hasAdvanced && values.length != 0 ? (
          <>
            <div className="grow" />
            <button
              className="btn flex-none"
              onClick={() => setShowMore(!showMore)}
              data-testid={`${kind}.<more>`}
            >
              {showMore ? "Less..." : "More..."}
            </button>
          </>
        ) : null}
      </div>
      <div>
        {values
          .filter(() => !collapsed)
          .map((v, i) => {
            const updatedModel = customizeModel(model, v);
            const colorClass: string =
              model.kind == "emachine" &&
              system.candidates.emachine &&
              (selected == i || !system.components.emachine)
                ? "border-b-3 p-1 " +
                  findColorEntry(system.candidates.emachine, v)[0]
                : "";
            return (
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
                  <div className="justify-self-center text-sm">
                    <label
                      data-testid={`${kind}[${i}].label.<selected>`}
                      className={colorClass}
                    >
                      <input
                        type="radio"
                        checked={selected == i}
                        onChange={() => {
                          /* no-op */
                        }}
                        className="m-1"
                        data-testid={`${kind}[${i}].<selected>`}
                      />
                      Select
                    </label>
                  </div>
                  {Object.keys(updatedModel.params)
                    .filter((k) => !updatedModel.params[k].hidden)
                    .filter((k) => showMore || !updatedModel.params[k].advanced)
                    .map((k, j) => (
                      <div key={j}>
                        <Param
                          id={`${kind}[${i}].${k}`}
                          model={updatedModel.params[k]}
                          value={v[k]}
                        />
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

function Param({
  id,
  model,
  value,
}: {
  id: string;
  model: ComponentParam;
  value: any;
}) {
  return (
    <div className="p-1">
      <div className="text-sm break-normal">{model.label}:</div>
      <div className="border break-normal" data-testid={id}>
        {renderComponentParam(model, value)}
      </div>
    </div>
  );
}
