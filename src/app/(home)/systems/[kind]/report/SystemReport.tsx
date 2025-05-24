import {
  ComponentsType,
  getComponentModel,
  renderComponentParam,
} from "@/model/component";
import { System, SystemModel } from "@/model/system";
import { getSystemParamModel, SystemParamsType } from "@/model/system-params";
import { round } from "@/model/utils";
import { useRouter } from "next/navigation";
import Schema from "../Schema";

export default function SystemReport({
  id,
  system,
  model,
}: {
  id: string;
  system: System;
  model: SystemModel;
}) {
  const router = useRouter();
  return (
    <>
      <div className="p-4 text-xl">Report</div>
      <div>
        <div className="grid gap-2 lg:grid-cols-2">
          <div>
            <Schema model={model} />
          </div>
          <div>Picture</div>
        </div>
        <div className="flex p-2 gap-2">
          <div
            className="btn flex-none"
            onClick={() => router.push(`/systems/${model.kind}?id=${id}`)}
          >
            Go back
          </div>
        </div>
        {system.params ? (
          <div className="grid lg:grid-cols-3">
            <SystemParams params={system.params} />
            <ComponentParams components={system.components} />
          </div>
        ) : (
          <div className="text-lg text-red-600">Sizing is incomplete!</div>
        )}
      </div>
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
              <div className="text-left">
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
        const model = getComponentModel(kind);
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
                    <div className="text-left">
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
