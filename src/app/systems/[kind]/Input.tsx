"use client";

import {
  SystemContextType,
  getSystem,
  saveSystem,
  updateParam,
} from "@/model/store";
import { SystemKind, customizeModel, getModel } from "@/model/system";
import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import Candidates from "./Candidates";
import Graph from "./Graph";
import Param from "./Param";
import Schema from "./Schema";
import Errors from "./Errors";
import { withCandidates } from "@/model/sizing";

export const SystemContext = createContext({} as SystemContextType);

export default function Input({ kind }: { kind: SystemKind }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (id == null) {
    throw new Error(`id is not found: ${id}`);
  }

  const system = getSystem(id);
  const [value, setValue] = useState(system);
  const [errors, setErrors] = useState([] as string[]);
  const [showMore, setShowMore] = useState(false);
  const [showCalculated, setShowCalculated] = useState(false);
  const [update, setUpdate] = useState(0);
  const [updateCalculated, setUpdateCalculated] = useState(0);

  useEffect(() => {
    saveSystem(id, value);
  }, [id, value]);

  const context: SystemContextType = {
    id,
    model: customizeModel(getModel(kind), value),
    system: value,
  };

  return (
    <SystemContext.Provider value={context}>
      <div className="grid gap-2 lg:grid-cols-2">
        <div>
          <Schema
            model={context.model}
            onSelect={(element) => {
              setErrors([]);
              setValue({ ...value, element });
            }}
          />
          <div className="border p-2">
            <div className="grid gap-2 lg:grid-cols-3">
              {Object.entries(context.model.input)
                .filter(([k, _]) => k == value.element)
                .flatMap(([_, v]) => Object.entries(v.params))
                .filter(([_, v]) => showMore || !v.advanced)
                .filter(([_, v]) => !v.hidden)
                .filter(
                  ([_, v]) =>
                    // hide calculated fields in case of errors
                    (showCalculated && errors.length == 0) ||
                    typeof v.value != "function",
                )
                .map(([k, v]) => (
                  <Param
                    key={`${context.system.element}.${k}.${update}.${
                      typeof v.value == "function" ? updateCalculated : ""
                    }`}
                    name={k}
                    handleChange={(v) => {
                      const updated = updateParam(context, k, v);
                      const errors = context.model.validate
                        ? context.model.validate(updated)
                        : [];
                      setErrors(errors);
                      if (errors.length == 0) {
                        setValue(updated);
                        setUpdateCalculated(updateCalculated + 1);
                      }
                    }}
                    resetErrors={() => setErrors([])}
                  ></Param>
                ))}
            </div>
          </div>
          <div className="flex p-2 gap-2">
            <div
              className="btn flex-none"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Less..." : "More..."}
            </div>
            <div
              className="btn flex-none"
              onClick={() => setShowCalculated(!showCalculated)}
            >
              {showCalculated ? "Hide calculated..." : "Show calculated..."}
            </div>
            <div className="grow" />
            <div className="btn flex-none">Show report</div>
          </div>
          <div hidden={errors.length == 0}>
            <Errors
              errors={errors}
              handleDismissClick={() => {
                setUpdate(update + 1);
                setErrors([]);
              }}
            ></Errors>
          </div>
        </div>
        <div hidden={errors.length != 0}>
          <Graph />
        </div>
        <div className="lg:col-span-2" hidden={errors.length != 0}>
          <div className="text-2xl">Candidates</div>
          <Candidates
            onSelect={(name, candidate) => {
              const system = {
                ...context.system,
                components: { ...context.system.components, [name]: candidate },
              };

              setValue(withCandidates(system));
            }}
          />
        </div>
      </div>
    </SystemContext.Provider>
  );
}
