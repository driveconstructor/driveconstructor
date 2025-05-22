"use client";

import { withCandidates } from "@/model/sizing";
import {
  SystemContextType,
  createSystem,
  saveSystem,
  updateParam,
} from "@/model/store";
import { System, SystemModel, customizeModel } from "@/model/system";
import { createContext, useEffect, useState } from "react";
import Candidates from "./Candidates";
import Errors from "./Errors";
import Graph from "./Graph";
import Param from "./Param";
import Schema from "./Schema";

export const SystemContext = createContext({} as SystemContextType);

export default function Input({
  id,
  system,
  model,
  setShowReport,
}: {
  id: string;
  system: System;
  model: SystemModel;
  setShowReport: (v: boolean) => void;
}) {
  const [value, setValue] = useState(system);
  const [errors, setErrors] = useState([] as string[]);
  const [showMore, setShowMore] = useState(false);
  const [update, setUpdate] = useState({ exclude: "", count: 0 });

  useEffect(() => {
    saveSystem(id, value);
  }, [id, value]);

  const context: SystemContextType = {
    id,
    model: customizeModel(model, value),
    system: value,
  };

  const resetErrors = () => {
    setUpdate({ exclude: "", count: update.count + 1 });
    setErrors([]);
  };

  return (
    <SystemContext.Provider value={context}>
      <div
        className="grid gap-2 lg:grid-cols-2"
        onKeyUp={(e) => {
          if (e.key == "Escape") {
            resetErrors();
          }
        }}
      >
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
                    (showMore && errors.length == 0) ||
                    typeof v.value != "function",
                )
                .map(([k, _]) => (
                  <Param
                    key={`${context.system.element}.${k}.${k == update.exclude ? "" : update.count}}`}
                    name={k}
                    handleChange={(v) => {
                      const updated = updateParam(context, k, v);
                      const errors = context.model.validate
                        ? context.model.validate(updated)
                        : [];
                      setErrors(errors);
                      if (errors.length == 0) {
                        setValue(updated);
                        setUpdate({ exclude: k, count: update.count + 1 });
                      }
                    }}
                    setErrors={setErrors}
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
            <div className="grow" />
            <div
              className="btn"
              onClick={() => {
                const result = createSystem(context.model);
                setErrors([]);
                setValue(result.system);
                setUpdate({ exclude: "", count: update.count + 1 });
              }}
            >
              Reset
            </div>
            <div className="btn flex-none" onClick={() => setShowReport(true)}>
              Show report
            </div>
          </div>
          <div hidden={errors.length == 0}>
            <Errors errors={errors} handleDismissClick={resetErrors}></Errors>
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
