import Schema from "@/app/systems/[kind]/[element]/Schema";
import applications from "@/model/application";
import { SystemModel } from "@/model/system";
import Link from "next/link";
import React from "react";
import NewSystemButton from "./NewSystemButton";

export default function Page({ params }: { params: { kind: string } }) {
  const model = applications.find((a) => a.name == params.kind);
  if (model == null) {
    throw new Error(`${params.kind} is not found`);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Select topology for your system</h1>
      <div>{model.systemHeader}</div>
      <div className="flex">{model.systems.map(renderSystemModel)}</div>
    </div>
  );
}

function renderSystemModel(model: SystemModel): React.ReactNode {
  return (
    <div
      key={model.kind}
      className="mx-2 basis-1/4 space-y-2 border border-gray-200 px-2 py-2"
    >
      <Schema model={model} viewOnly={true} />
      <h3 className="text-xl">{model.title}</h3>
      <div>{model.description}</div>
      <div className="flex justify-end space-x-1">
        <NewSystemButton kind={model.kind} />
        <Link className="btn" href="#tbd">
          Help
        </Link>
      </div>
    </div>
  );
}

export function generateStaticParams(): { kind: string }[] {
  return applications.map((m) => {
    return { kind: m.name };
  });
}
