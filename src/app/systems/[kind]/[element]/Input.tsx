"use client";

import {
  SystemContextType,
  getSystem,
  saveSystem,
  updateSystem,
} from "@/model/store";
import {
  customizeModel,
  getModel,
  getSystemKindsWithlements,
} from "@/model/system";
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
    model: customizeModel(model, value),
    element: params.element,
    system: value,
  };

  return (
    <SystemContext.Provider value={context}>
      <div className="grid gap-2 lg:grid-cols-2">
        <div>
          <Schema model={model} />
          <div className="border p-2">
            <div className="grid gap-2 md:grid-cols-3">
              {Object.entries(model.input)
                .filter(([k, _]) => k == params.element)
                .flatMap(([_, v]) => Object.entries(v.params))
                .filter(([_, v]) => value.showMore || v.advanced == null)
                .map(([k, _]) => (
                  <Param
                    key={k}
                    name={k}
                    handleChange={(v) => {
                      setValue(updateSystem(context, k, v));
                    }}
                  ></Param>
                ))}
            </div>
          </div>
          <div className="flex p-2">
            <div
              className="btn flex-none"
              onClick={() => setValue({ ...value, showMore: !value.showMore })}
            >
              {value.showMore ? "Less..." : "More..."}
            </div>
            <div className="grow" />
            <div className="btn flex-none">Show report</div>
          </div>
        </div>
        <div className="border border-blue-500">ChartJS</div>
      </div>
      <div className="col-span-2">
        <div className="text-lg">Candidates</div>
        <Candidates />
      </div>
    </SystemContext.Provider>
  );
}

export function generateStaticParams(): Params[] {
  return getSystemKindsWithlements();
}
