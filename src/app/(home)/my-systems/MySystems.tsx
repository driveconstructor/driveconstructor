"use client";

import { deleteSystem, getSystems } from "@/model/store";
import { customizeModel, getModel, System } from "@/model/system";
import { getSystemParamModel, SystemParamsType } from "@/model/system-params";
import { round } from "@/model/utils";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import Schema from "../systems/[kind]/Schema";
import ComparisonGraph from "./ComparisonGraph";

export function MySystems() {
  const [systems, setSystems] = useState(getSystems());
  const [selected, setSelected] = useState([] as string[]);
  return (
    <div className="flex-col">
      {systems.map((v) => (
        <SystemRow
          key={v.id}
          system={v}
          selected={selected}
          setSelected={setSelected}
          systems={systems}
          setSystems={setSystems}
        />
      ))}
      <div className="grid grid-cols-2">
        <div className="">Selected fields</div>
        <ComparisonGraph />
      </div>
    </div>
  );
}

export function SystemRow({
  system,
  selected,
  setSelected,
  systems,
  setSystems,
}: {
  system: System;
  selected: string[];
  setSelected: (selected: string[]) => void;
  systems: System[];
  setSystems: (selected: System[]) => void;
}) {
  const model = customizeModel(getModel(system.kind), system);
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3 border-1">
        <div className="flex flex-wrap items-center">
          <input
            type="checkbox"
            className="m-1"
            checked={selected.includes(system.id)}
            onChange={(e) =>
              e.target.checked
                ? setSelected([...selected, system.id])
                : setSelected(selected.filter((v) => v != system.id))
            }
          />
          <div>
            <Link href={`/systems/${system.kind}?id=${system.id}`}>
              <ArrowTopRightOnSquareIcon
                className="m-1"
                width={16}
                height={16}
              />
            </Link>
          </div>
          <div
            className="hover:cursor-pointer"
            onClick={() => {
              if (
                confirm(`Are you sure you want to delete '${system.name}'?`)
              ) {
                deleteSystem(system.id);
                setSystems(systems.filter((s) => s.id != system.id));
                setSelected(selected.filter((s) => s != system.id));
              }
            }}
          >
            <TrashIcon className="m-1" width={16} height={16} />
          </div>
          <div className="m-1 border-1">{system.name}</div>
        </div>
        <Schema model={model} />
      </div>
      <div className="col-span-9">
        {system.params == null ? null : <SystemParams params={system.params} />}
      </div>
    </div>
  );
}

function SystemParams({ params }: { params: SystemParamsType }) {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8">
      {Object.entries(params).map(([k, v]) => {
        const model = getSystemParamModel(k);
        return (
          <div key={k} className="break-normal border-1">
            <div className="text-sm">{model.label}:</div>
            <div className="text-left">
              {v == null ? "N/A" : round(v, model.precision)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
