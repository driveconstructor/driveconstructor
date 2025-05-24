"use client";

import { getSystem } from "@/model/store";
import { SystemKind, getModel } from "@/model/system";
import { useSearchParams } from "next/navigation";
import Input from "./Input";
import SystemReport from "./report/SystemReport";

export default function System({
  kind,
  showReport,
}: {
  kind: SystemKind;
  showReport: boolean;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id == null) {
    throw new Error(`id is not found: ${id}`);
  }

  const system = getSystem(id);
  const model = getModel(kind);
  const draft = system.name == null;

  return (
    <div>
      <div className="flex items-center">
        <div className="p-4 text-2xl">{model.title}</div>
        <div>
          <span
            className={
              (draft ? "bg-gray-100" : "bg-blue-100") +
              " text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
            }
          >
            {draft ? "draft" : system.name}
          </span>
        </div>
      </div>
      {showReport ? (
        <SystemReport id={id} system={system} model={model} />
      ) : (
        <Input id={id} system={system} model={model} />
      )}
    </div>
  );
}
