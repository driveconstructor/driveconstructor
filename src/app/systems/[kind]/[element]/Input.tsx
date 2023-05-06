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
      <div>
        <h2>Schema:</h2>
        <Schema model={model} />
        <h3>Input</h3>
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
        <h3>Candidates</h3>
        <Candidates />
      </div>
    </SystemContext.Provider>
  );
}

export function generateStaticParams(): Params[] {
  return getSystemKindsWithlements();
}
