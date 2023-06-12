import PageTemplate from "@/app/PageTemplate";
import Schema from "@/app/systems/[kind]/Schema";
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
    <PageTemplate
      title="Select topology for your system"
      text={model.systemHeader}
    >
      <div className="grid gap-2 p-4 lg:grid-cols-4">
        {model.systems.map(renderSystemModel)}
      </div>
    </PageTemplate>
  );
}

function renderSystemModel(model: SystemModel): React.ReactNode {
  return (
    <div key={model.kind} className="border border-gray-200 p-2">
      <Schema model={model} />
      <h3 className="text-xl">{model.title}</h3>
      <div>{model.description}</div>
      <div className="m-4 flex justify-end space-x-1">
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
