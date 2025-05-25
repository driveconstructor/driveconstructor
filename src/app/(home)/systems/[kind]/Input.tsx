"use client";

import { withCandidates } from "@/model/sizing";
import { createSystem, saveSystem, updateParam } from "@/model/store";
import { System } from "@/model/system";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Candidates from "./Candidates";
import Errors from "./Errors";
import Graph from "./Graph";
import Param from "./Param";
import Schema from "./Schema";
import { SystemContext } from "./System";

export default function Input({
  setSystem,
}: {
  setSystem: (system: System) => void;
}) {
  const [errors, setErrors] = useState([] as string[]);
  const [showMore, setShowMore] = useState(false);
  const [update, setUpdate] = useState({ exclude: "", count: 0 });
  const { system, model } = useContext(SystemContext);

  useEffect(() => {
    saveSystem(system);
  }, [system]);

  const resetErrors = () => {
    setUpdate({ exclude: "", count: update.count + 1 });
    setErrors([]);
  };

  const router = useRouter();

  return (
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
          model={model}
          onSelect={(element) => {
            setErrors([]);
            setSystem({ ...system, element });
          }}
        />
        <div className="border p-2">
          <div className="grid gap-2 lg:grid-cols-3">
            {Object.entries(model.input)
              .filter(([k, _]) => k == system.element)
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
                  key={`${system.element}.${k}.${k == update.exclude ? "" : update.count}}`}
                  name={k}
                  handleChange={(v) => {
                    const updated = updateParam(model, system, k, v);
                    const errors = model.validate
                      ? model.validate(updated)
                      : [];
                    setErrors(errors);
                    if (errors.length == 0) {
                      setSystem(updated);
                      setUpdate({ exclude: k, count: update.count + 1 });
                    }
                  }}
                  setErrors={setErrors}
                ></Param>
              ))}
          </div>
        </div>
        <div className="flex p-2 gap-2">
          <button
            className="btn flex-none"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Less..." : "More..."}
          </button>
          <div className="grow" />
          <button
            hidden={system.params == null}
            className="btn flex-none"
            onClick={() =>
              router.push(`/systems/${model.kind}/report/?id=${system.id}`)
            }
          >
            Show report
          </button>
          <button
            className="btn"
            onClick={() => {
              const newSystem = createSystem(model);
              setErrors([]);
              setSystem(newSystem);
              setUpdate({ exclude: "", count: update.count + 1 });
            }}
          >
            Reset
          </button>
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
            const updated = {
              ...system,
              components: { ...system.components, [name]: candidate },
            };

            setSystem(withCandidates(updated));
          }}
        />
      </div>
    </div>
  );
}
