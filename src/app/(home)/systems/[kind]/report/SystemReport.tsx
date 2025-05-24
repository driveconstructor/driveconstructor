import { System, SystemModel } from "@/model/system";
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
    <div>
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
        <div className="grid gap-2 lg:grid-cols-2">
          <div>System parameters</div>
          <div>
            {system.params ? (
              Object.entries(system.params).map(([k, v]) => {
                return (
                  <div key={k}>
                    {k} {v}
                  </div>
                );
              })
            ) : (
              <div>Incomplete!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
