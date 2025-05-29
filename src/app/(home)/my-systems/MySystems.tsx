"use client";

import { duplicateSystem, getSystems, saveSystem } from "@/model/store";
import { customizeModel, getModel, System } from "@/model/system";
import {
  getSystemParamModel,
  SystemParamsModel,
  SystemParamsType,
} from "@/model/system-params";
import { round } from "@/model/utils";
import {
  ArrowDownOnSquareIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import Schema from "../systems/[kind]/Schema";
import ComparisonGraph from "./ComparisonGraph";

function nonNullParams(systems: System[], selected: string[]) {
  return Object.keys(SystemParamsModel).filter(
    (k) =>
      systems
        .filter((s) => selected.includes(s.id))
        .filter((s) => s.params != null)
        .flatMap((s) => (s.params as any)[k])
        .filter((v) => v == null).length == 0,
  );
}

export function MySystems() {
  const [systems, setSystems] = useState([] as System[]);
  const [comparableParams, setComparableParams] = useState([] as string[]);

  useEffect(() => {
    setSystems(getSystems());
  }, []);

  useEffect(() => {
    systems.forEach(saveSystem);
  }, [systems]);

  const [selected, setSelected] = useState([] as string[]);
  useEffect(() => {
    setComparableParams(nonNullParams(systems, selected));
  }, [systems, selected]);

  function SystemRow({ index, system }: { index: number; system: System }) {
    const model = customizeModel(getModel(system.kind), system);
    const iconAttributes = {
      width: 16,
      height: 16,
      className: "m-1",
    };
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-3 border-1">
          <div className="flex flex-wrap items-center">
            <input
              type="checkbox"
              className="m-1"
              disabled={system.params == null}
              checked={selected.includes(system.id)}
              onChange={(e) =>
                e.target.checked
                  ? setSelected([...selected, system.id])
                  : setSelected(selected.filter((v) => v != system.id))
              }
              data-testid={`system[${index}].<select>`}
            />
            <div>
              <Link
                href={`/systems/${system.kind}?id=${system.id}`}
                data-testid={`system[${index}].<edit>`}
              >
                <PencilIcon {...iconAttributes} />
              </Link>
            </div>
            <div
              className="hover:cursor-pointer"
              data-testid={`system[${index}].<delete>`}
              onClick={() => {
                if (
                  confirm(`Are you sure you want to delete '${system.name}'?`)
                ) {
                  setSystems(systems.filter((s) => s.id != system.id));
                  setSelected(selected.filter((s) => s != system.id));
                }
              }}
            >
              <TrashIcon {...iconAttributes} />
            </div>
            <div
              className="hover:cursor-pointer"
              data-testid={`system[${index}].<duplicate>`}
              onClick={() => {
                const newName = prompt(
                  "Enter new system name:",
                  system.name + " copy",
                );
                if (newName) {
                  const newSystem = duplicateSystem(system.id, newName);
                  setSystems([...systems, newSystem]);
                }
              }}
            >
              <DocumentDuplicateIcon {...iconAttributes} />
            </div>
            <div
              className="hover:cursor-pointer"
              data-testid={`system[${index}].<rename>`}
              onClick={() => {
                const newName = prompt("Enter system name:", system.name);
                if (newName) {
                  const newSystem = { ...system, name: newName };
                  setSystems([
                    ...systems.filter((s) => s.id != newSystem.id),
                    newSystem,
                  ]);
                }
              }}
            >
              <TagIcon {...iconAttributes} />
            </div>
            <div
              className="m-1 border-1"
              data-testid={`system[${index}].<name>`}
            >
              {system.name}
            </div>
          </div>
          <Schema model={model} />
          <div className="text-xs">
            Updated: {new Date(system.timeUpdated).toLocaleString()}
          </div>
        </div>
        <div className="col-span-9">
          {system.params == null ? null : (
            <SystemParams index={index} params={system.params} />
          )}
        </div>
      </div>
    );
  }

  function ParameterSelection() {
    return (
      <div className="flow">
        <div className="pb-2">Parameter selection (minimum 3)</div>
        {Object.entries(SystemParamsModel)
          .filter(([k, _]) => nonNullParams(systems, selected).includes(k))
          .map(([k, v]) => {
            return (
              <div key={k}>
                <input
                  type="checkbox"
                  checked={comparableParams.includes(k)}
                  className="m-1"
                  onChange={(e) => {
                    e.target.checked
                      ? setComparableParams([...comparableParams, k])
                      : comparableParams.length <= 3 ||
                        setComparableParams(
                          comparableParams.filter((c) => c != k),
                        );
                  }}
                />
                <label>{v.label}</label>
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="text-2xl p-4">My systems</div>
        <div className="flex">
          <ArrowDownOnSquareIcon
            title="Export..."
            className="hover:cursor-pointer rotate-180"
            width={24}
            height={24}
            onClick={() => {
              const file = prompt(
                "Enter export file name:",
                "dc.my-systems.json",
              );
              if (file != null) {
                const link = document.createElement("a");
                link.download = file;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.href = `data:application/json,${encodeURIComponent(JSON.stringify(systems))}`;
                link.click();
              }
            }}
          ></ArrowDownOnSquareIcon>

          <label title="Import...">
            <ArrowDownOnSquareIcon
              width={24}
              height={24}
              className="hover:cursor-pointer"
            />

            <input
              id="file-import"
              style={{ display: "none" }}
              type="file"
              accept="application/json"
              onChange={(e) => {
                const reader = new FileReader();
                if (e.target.files != null) {
                  reader.onload = () => {
                    if (typeof reader.result == "string") {
                      const imported = JSON.parse(reader.result) as System[];
                      setSystems([
                        // keep non-matching systems
                        ...systems.filter(
                          (s) => !imported.map((i) => i.id).includes(s.id),
                        ),
                        ...imported,
                      ]);
                    }
                  };
                  reader.readAsText(e.target.files[0]);
                }
              }}
            ></input>
          </label>
        </div>
      </div>
      <div className="flex-col">
        {systems
          .sort((a, b) => b.timeUpdated - a.timeUpdated)
          .map((v, index) => (
            <SystemRow key={v.id} index={index} system={v} />
          ))}
        <div className="text-xl p-4">Comparison</div>
        {selected.length <= 1 ? (
          <div>Select 2 and more systems to compare...</div>
        ) : (
          <>
            <div className="grid lg:grid-cols-12">
              <div className="col-span-4">
                <ParameterSelection />
              </div>
              <div className="col-span-6">
                <ComparisonGraph
                  systems={systems.filter((s) => selected.includes(s.id))}
                  model={Object.fromEntries(
                    Object.entries(SystemParamsModel).filter(([k, v]) =>
                      comparableParams.includes(k),
                    ),
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SystemParams({
  index,
  params,
}: {
  index: number;
  params: SystemParamsType;
}) {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8">
      {Object.entries(params).map(([k, v]) => {
        const model = getSystemParamModel(k);
        return (
          <div key={k} className="break-normal border-1">
            <div className="text-sm">{model.label}:</div>
            <div className="text-left" data-testid={`system[${index}][${k}]`}>
              {v == null ? "N/A" : round(v, model.precision)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
