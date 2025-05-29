import {
  ComponentsType,
  customizeModel,
  getComponentModel,
  renderComponentParam,
} from "@/model/component";
import { getSystemParamModel, SystemParamsType } from "@/model/system-params";
import { round } from "@/model/utils";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useContext } from "react";
import Graph from "../Graph";
import Schema from "../Schema";
import { SystemContext } from "../System";

export default function SystemReport() {
  const context = useContext(SystemContext);
  const { system, model } = context;
  return (
    <>
      <div className="flex items-center">
        <div>
          <Link
            href={`/systems/${model.kind}?id=${system.id}`}
            data-testid="go-back-link"
          >
            <ArrowLeftStartOnRectangleIcon width={24} height={24} />
          </Link>
        </div>
        <div className="p-2 text-xl">Report</div>
      </div>
      {system.params ? (
        <div>
          <div className="grid gap-2 lg:grid-cols-2">
            <div>
              <Schema model={model} />
              <SystemParams params={system.params} />
            </div>
            <div>
              <Graph />
            </div>
          </div>

          <div className="grid lg:grid-cols-3">
            <ComponentParams components={system.components} />
          </div>
        </div>
      ) : (
        <div className="text-lg text-red-600">Sizing is incomplete!</div>
      )}
    </>
  );
}

function SystemParams({ params }: { params: SystemParamsType }) {
  return (
    <div>
      <div className="text-xl gap-4">System parameters</div>
      <div>
        {Object.entries(params).map(([k, v]) => {
          const model = getSystemParamModel(k);
          return (
            <div key={k} className="grid grid-cols-2">
              <div className="text-">{model.label}:</div>
              <div className="text-left" data-testid={k}>
                {v == null ? "N/A" : round(v, model.precision)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComponentParams({ components }: { components: ComponentsType }) {
  return (
    <>
      {Object.entries(components).map(([kind, v]) => {
        const model = customizeModel(getComponentModel(kind), v);
        return (
          <div key={kind}>
            <div className="text-xl gap-4" key={kind}>
              {model.title}
            </div>
            <div>
              {Object.entries(model.params)
                .filter(([_, p]) => !p.hidden)
                .map(([n, p]) => (
                  <div key={n} className="grid grid-cols-2">
                    <div className="text-">{p.label}:</div>
                    <div className="text-left" data-testid={`${kind}[${n}]`}>
                      {renderComponentParam(p, (v as any)[n])}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
