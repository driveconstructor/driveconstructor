"use client";

import { getApplicationType } from "@/model/application";
import {
  createNamedSystem,
  createSystem,
  getSystem,
  isDraft,
  saveSystem,
  SystemContextType,
  updateSystem,
} from "@/model/store";
import {
  customizeModel,
  getModel,
  SystemKind,
  System as SystemType,
} from "@/model/system";
import { packValues, unpackValues } from "@/model/system-utils";
import {
  ArrowDownTrayIcon,
  LinkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
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
  const [system, setSystem] = useState(undefined as SystemType | undefined);
  const [name, setName] = useState(system?.name);
  const router = useRouter();

  const searchParams = useSearchParams();
  useEffect(() => {
    const values = searchParams.get("values");
    if (values != null) {
      const unpackedValues = unpackValues(values);
      const system = createSystem(getModel(kind), unpackedValues);
      router.push(`/systems/${kind}/?id=${system.id}`);
      return;
    }

    const id = searchParams.get("id");
    if (id == null) {
      throw new Error(`id is not found: ${id}`);
    }

    setSystem(getSystem(id));
  }, [searchParams]);

  useEffect(() => {
    // system is never undefined at this point
    saveSystem(updateSystem(system as SystemType));
    setName(system?.name);
  }, [system]);

  if (typeof system == "undefined") {
    return;
  }

  const model = getModel(kind);

  const context: SystemContextType = {
    model: customizeModel(model, system),
    system,
  };

  function handleClick(system: SystemType) {
    const newName = prompt(
      "Enter system name:",
      isDraft(system) ? `New ${getApplicationType(kind)} system` : name,
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
            onClick={() => handleClick(system)}
            data-testid="save"
          >
            {isDraft(system) ? (
              <ArrowDownTrayIcon {...iconAttributes} />
            ) : (
              <TagIcon {...iconAttributes} />
            )}
          </div>
          <div
            className={(isDraft(system) ? "text-gray-500" : "") + "m-1"}
            data-testid="system-name"
          >
            {name}
          </div>
          <div
            className="m-1 hover:cursor-pointer"
            title="Copy permanent link"
            onClick={() => {
              const encoded = packValues(model, system);
              const url = window.location.href.split("?")[0];
              navigator.clipboard.writeText(url + "?values=" + encoded);
            }}
          >
            <LinkIcon width={20} height={20} />
          </div>
        </div>
      </div>
      <SystemContext.Provider value={context}>
        {showReport ? <SystemReport /> : <Input setSystem={setSystem} />}
      </SystemContext.Provider>
    </div>
  );
}
