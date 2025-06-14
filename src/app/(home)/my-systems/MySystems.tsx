"use client";

import { duplicateSystem, getSystems, saveSystems } from "@/model/store";
import { customizeModel, getModel, System } from "@/model/system";
import {
  getSystemParamModel,
  SystemParamsModel,
  SystemParamsType,
} from "@/model/system-params";
import { round } from "@/model/utils";
import {
  ArrowDownOnSquareStackIcon,
  ArrowUpOnSquareStackIcon,
  ClipboardDocumentCheckIcon,
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
  const [systems, setSystems] = useState(undefined as System[] | undefined);
  const [comparableParams, setComparableParams] = useState([] as string[]);

  useEffect(() => {
    setSystems(getSystems());
  }, []);

  useEffect(() => {
    if (typeof systems != "undefined") {
      saveSystems(systems);
    }
  }, [systems]);

  const [selected, setSelected] = useState([] as string[]);
  useEffect(() => {
    if (typeof systems != "undefined") {
      setComparableParams(nonNullParams(systems, selected));
    }
  }, [systems, selected]);

  if (typeof systems == "undefined") {
    return;
  }

  function SystemRow({
    index,
    system,
    systems,
  }: {
    index: number;
    system: System;
    systems: System[];
  }) {
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
              className="cursor-pointer"
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
              className="cursor-pointer"
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

  function ParameterSelection({ systems }: { systems: System[] }) {
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

  function Toolbox({ systems }: { systems: System[] }) {
    const iconAttributes = {
      width: 24,
      height: 24,
    };

    const defaultClassName = "cursor-pointer";
    const selectedClassName =
      selected.length > 0 ? defaultClassName : "pointer-events-none opacity-50";

    return (
      <div className="flex items-center">
        <div className="text-2xl p-4">My systems</div>
        <div className="flex">
          <ArrowUpOnSquareStackIcon
            className={selectedClassName}
            title="Export selected"
            {...iconAttributes}
            onClick={() => {
              const file = prompt(
                "Enter export file name:",
                "dc.my-systems.json",
              );
              if (file != null) {
                saveSelectedSystems(
                  file,
                  systems.filter((s) => selected.includes(s.id)),
                );
              }
            }}
          />

          <label title="Import">
            <ArrowDownOnSquareStackIcon
              {...iconAttributes}
              className={defaultClassName}
            />

            <input
              id="file-import"
              style={{ display: "none" }}
              type="file"
              accept="application/json"
              data-testid="import"
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

          <ClipboardDocumentCheckIcon
            {...iconAttributes}
            className={defaultClassName}
            title={
              selected.length == systems.length ? "Deselect all" : "Select all"
            }
            onClick={() => {
              if (selected.length == systems.length) {
                setSelected([]);
              } else {
                setSelected(systems.map((s) => s.id));
              }
            }}
          />

          <TrashIcon
            {...iconAttributes}
            title="Delete"
            className={selectedClassName}
            onClick={() => {
              if (confirm(`Confirm removal of ${selected.length} systems?`)) {
                setSystems(systems.filter((s) => !selected.includes(s.id)));
                setSelected([]);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toolbox systems={systems} />
      <div className="flex-col">
        {systems
          .sort((a, b) => b.timeUpdated - a.timeUpdated)
          .map((v, index) => (
            <SystemRow key={v.id} index={index} system={v} systems={systems} />
          ))}
        <div className="text-xl p-4">Comparison</div>
        {selected.length <= 1 ? (
          <div>Select 2 and more systems to compare...</div>
        ) : (
          <>
            <div className="grid lg:grid-cols-12">
              <div className="col-span-4">
                <ParameterSelection systems={systems} />
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

function saveSelectedSystems(file: string, systems: System[]) {
  const link = document.createElement("a");
  link.download = file;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.href = `data:application/json,${encodeURIComponent(JSON.stringify(systems))}`;
  link.click();
}
