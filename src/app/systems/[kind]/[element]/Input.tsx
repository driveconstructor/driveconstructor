"use client";

import {
  SystemContextType,
  getSystem,
  saveSystem,
  updateSystem,
} from "@/model/store";
import { getModel, getSystemKindsWithlements } from "@/model/system";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import Param from "./Param";
import Schema from "./Schema";
import { Params } from "./page";

function Candidates() {
  const context = useContext(SystemContext);
  return <div>Candidate: {context.model.findCandidates(context.system)}</div>;
}

export const SystemContext = createContext({} as SystemContextType);

export default function Client({ params }: { params: Params }) {
  const model = getModel(params.kind);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id == null) {
    throw new Error(`id is not found: ${id}`);
  }

  const system = getSystem(id);
  const [value, setValue] = useState(system);

  useEffect(() => {
    saveSystem(id, value);
  }, [id, value]);

  const context: SystemContextType = {
    id,
    model,
    element: params.element,
    system: value,
  };

  return (
    <SystemContext.Provider value={context}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Schema model={model} />
          {Object.entries(model.input)
            .filter(([k, _]) => k == params.element)
            .flatMap(([_, v]) => Object.entries(v.params))
            .map(([k, _]) => (
              <div key={k}>
                <Param
                  name={k}
                  handleChange={(v) => {
                    setValue(updateSystem(context, k, v));
                  }}
                ></Param>
              </div>
            ))}
        </div>
        <div className="border border-blue-500">ChartJS</div>
        <div className="col-span-2 ">
          <div className="text-lg">Candidates</div>
          <Candidates />
        </div>
      </div>
    </SystemContext.Provider>
  );
}

export function generateStaticParams(): Params[] {
  return getSystemKindsWithlements();
}
