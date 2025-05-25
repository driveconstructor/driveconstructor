"use client";

import { getSystem, SystemContextType } from "@/model/store";
import { customizeModel, getModel, SystemKind } from "@/model/system";
import { useSearchParams } from "next/navigation";
import { createContext, useState } from "react";
import Input from "./Input";
import SystemReport from "./report/SystemReport";

export const SystemContext = createContext({} as SystemContextType);

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

  const [system, setSystem] = useState(getSystem(id));
  const model = getModel(kind);

  const context: SystemContextType = {
    model: customizeModel(model, system),
    system,
  };
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
      <SystemContext.Provider value={context}>
        {showReport ? <SystemReport /> : <Input setSystem={setSystem} />}
      </SystemContext.Provider>
    </div>
  );
}
