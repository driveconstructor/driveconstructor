"use client";

import { findApplicationName } from "@/model/application";
import {
  createNamedSystem,
  getSystem,
  isDraft,
  saveSystem,
  SystemContextType,
  updateSystem,
} from "@/model/store";
import { customizeModel, getModel, SystemKind } from "@/model/system";
import { ArrowDownTrayIcon, TagIcon } from "@heroicons/react/24/outline";
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
    saveSystem(updateSystem(system));
    setName(system.name);
  }, [system]);

  function handleClick() {
    const newName = prompt(
      "Enter system name:",
      isDraft(system) ? `New ${findApplicationName(kind)} system` : name,
    );
    if (newName) {
      setName(newName);
      if (isDraft(system)) {
        const newSystem = createNamedSystem(system.id, newName);
        setSystem(newSystem);
        router.push(`/systems/${kind}/?id=${newSystem.id}`);
      } else {
        setSystem({ ...system, name: newName });
      }
    }
  }

  const iconAttributes = {
    width: 24,
    height: 24,
    className: "hover:cursor-pointer m-2",
    "data-testid": "save-icon",
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="p-4 text-2xl">{model.title}</div>
        <div className="flex items-center">
          <div
            hidden={system.params == null}
            onClick={handleClick}
            data-testid="save"
          >
            {isDraft(system) ? (
              <ArrowDownTrayIcon {...iconAttributes} />
            ) : (
              <TagIcon {...iconAttributes} />
            )}
          </div>
          <div
            className={isDraft(system) ? "text-gray-500" : ""}
            data-testid="system-name"
          >
            {name}
          </div>
        </div>
      </div>
      <SystemContext.Provider value={context}>
        {showReport ? <SystemReport /> : <Input setSystem={setSystem} />}
      </SystemContext.Provider>
    </div>
  );
}
