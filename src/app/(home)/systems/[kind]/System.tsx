"use client";

import {
  createNamedSystem,
  getSystem,
  isDraft,
  saveSystem,
  SystemContextType,
} from "@/model/store";
import { customizeModel, getModel, SystemKind } from "@/model/system";
import { ArrowDownTrayIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
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
  const [name, setName] = useState(system.name);
  const router = useRouter();

  useEffect(() => {
    saveSystem(system);
    setName(system.name);
  }, [system]);

  function handleSave() {
    const newName = prompt("Enter system name:", "System 1");
    if (newName) {
      setName(newName);
      const newSystem = createNamedSystem(system.id, newName);
      setSystem(newSystem);
      router.push(`/systems/${kind}/?id=${newSystem.id}`);
    }
  }

  function handleEdit() {
    const newName = prompt("Edit system name:", name);
    if (newName) {
      setName(newName);
      setSystem({ ...system, name: newName });
    }
  }
  const iconAttributes = {
    width: 16,
    height: 16,
    className: "hover:cursor-pointer m-2",
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="p-4 text-2xl">{model.title}</div>
        <div className="flex items-center">
          <div hidden={system.params == null}>
            {isDraft(system) ? (
              <ArrowDownTrayIcon {...iconAttributes} onClick={handleSave} />
            ) : (
              <PencilIcon {...iconAttributes} onClick={handleEdit} />
            )}
          </div>
          <div className={isDraft(system) ? "text-gray-500" : ""}>{name}</div>
        </div>
      </div>
      <SystemContext.Provider value={context}>
        {showReport ? <SystemReport /> : <Input setSystem={setSystem} />}
      </SystemContext.Provider>
    </div>
  );
}
