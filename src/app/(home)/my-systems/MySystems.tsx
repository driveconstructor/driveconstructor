"use client";

import { deleteSystem, getSystems } from "@/model/store";
import { customizeModel, getModel, System } from "@/model/system";
import { getSystemParamModel, SystemParamsType } from "@/model/system-params";
import { round } from "@/model/utils";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
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
        />
      ))}
      <div className="flex p-2 gap-2">
        <button
          className="btn flex-none"
          onClick={() => {
            selected.forEach(deleteSystem);
            setSystems(systems.filter((s) => !selected.includes(s.id)));
            setSelected([]);
          }}
        >
          Delete
        </button>
        <button className="btn flex-none" onClick={() => {}}>
          Compare
        </button>
      </div>
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
}: {
  selected: string[];
  setSelected: (selected: string[]) => void;
  system: System;
}) {
  const model = customizeModel(getModel(system.kind), system);
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3 border-1">
        <div className="flex flex-wrap items-center">
          <input
            type="checkbox"
            className="m-2"
            checked={selected.includes(system.id)}
            onChange={(e) =>
              e.target.checked
                ? setSelected([...selected, system.id])
                : setSelected(selected.filter((v) => v != system.id))
            }
          />
          {system.name}
          <Link href={`/systems/${system.kind}?id=${system.id}`}>
            <ArrowTopRightOnSquareIcon className="m-2" width={16} height={16} />
          </Link>
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
