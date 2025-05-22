import { System, SystemModel } from "@/model/system";

export default function SystemReport({
  system,
  model,
  setShowReport,
}: {
  system: System;
  model: SystemModel;
  setShowReport: (v: boolean) => void;
}) {
  return (
    <div className="flex">
      <div className="text-xl">Report</div>
      <div className="btn" onClick={() => setShowReport(false)}>
        Go back
      </div>
      <div>{JSON.stringify(system, null, 2)}</div>
    </div>
  );
}
