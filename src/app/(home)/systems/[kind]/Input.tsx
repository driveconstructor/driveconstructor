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
  const context = useContext(SystemContext);
  const { id, system } = context;

  useEffect(() => {
    saveSystem(id, system);
  }, [id, system]);

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
          model={context.model}
          onSelect={(element) => {
            setErrors([]);
            setSystem({ ...system, element });
          }}
        />
        <div className="border p-2">
          <div className="grid gap-2 lg:grid-cols-3">
            {Object.entries(context.model.input)
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
                  key={`${context.system.element}.${k}.${k == update.exclude ? "" : update.count}}`}
                  name={k}
                  handleChange={(v) => {
                    const updated = updateParam(context, k, v);
                    const errors = context.model.validate
                      ? context.model.validate(updated)
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
            hidden={context.system.params == null}
            className="btn flex-none"
            onClick={() =>
              router.push(`/systems/${context.model.kind}/report/?id=${id}`)
            }
          >
            Show report
          </button>
          <button
            className="btn"
            onClick={() => {
              const result = createSystem(context.model);
              setErrors([]);
              setSystem(result.system);
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
            const system = {
              ...context.system,
              components: { ...context.system.components, [name]: candidate },
            };

            setSystem(withCandidates(system));
          }}
        />
      </div>
    </div>
  );
}
