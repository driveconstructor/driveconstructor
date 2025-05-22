"use client";

import { getSystem } from "@/model/store";
import { SystemKind, getModel } from "@/model/system";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Input from "./Input";
import SystemReport from "./SystemReport";

export default function System({ kind }: { kind: SystemKind }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id == null) {
    throw new Error(`id is not found: ${id}`);
  }

  const system = getSystem(id);
  const model = getModel(kind);
  const [showReport, setShowReport] = useState(false);

  return (
    <div>
      <div className="flex items-center">
        <div className="p-4 text-2xl">{model.title}</div>
        <div>
          <span className="bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
            ({id})
          </span>
        </div>
      </div>
      {showReport ? (
        <SystemReport
          system={system}
          model={model}
          setShowReport={setShowReport}
        />
      ) : (
        <Input
          id={id}
          system={system}
          model={model}
          setShowReport={setShowReport}
        />
      )}
    </div>
  );
}
