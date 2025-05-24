"use client";

import { getSystems, IdAndSystem } from "@/model/store";
import { getModel } from "@/model/system";
import Link from "next/link";
import Schema from "../systems/[kind]/Schema";

export function MySystems() {
  return (
    <div className="flex-col">
      {getSystems().map((v) => (
        <SystemRow key={v.id} value={v} />
      ))}
    </div>
  );
}

export function SystemRow({ value }: { value: IdAndSystem }) {
  const { id, system } = value;
  const model = getModel(system.kind);
  return (
    <div className="flex items-center border-2">
      <input type="checkbox" className="m-2" />
      <Link
        href={`/systems/${system.kind}?id=${id}`}
        className="hover:text-blue-500"
      >
        {system.name}
      </Link>
      <Schema model={model} />
      <div>{JSON.stringify(system.params, null, 2)}</div>
    </div>
  );
}
