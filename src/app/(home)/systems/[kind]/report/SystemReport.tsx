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
      <div className="text-xl">Report</div>
      <div>
        <div
          className="btn"
          onClick={() => router.push(`/systems/${model.kind}?id=${id}`)}
        >
          Go back
        </div>
        <div className="grid gap-2 lg:grid-cols-2">
          <div>
            <Schema model={model} />
          </div>
          <div>Picture</div>
          <div>{JSON.stringify(system, null, 2)}</div>
          <div>{JSON.stringify(system, null, 2)}</div>
        </div>
      </div>
    </div>
  );
}
