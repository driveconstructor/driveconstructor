import Schema from "@/app/systems/[kind]/[element]/Schema";
import applications from "@/model/application";
import { SystemModel } from "@/model/system";
import React from "react";
import NewSystemButton from "./NewSystemButton";

export default function Page({ params }: { params: { kind: string } }) {
  const model = applications.find((a) => a.name == params.kind);
  if (model == null) {
    throw new Error(`${params.kind} is not found`);
  }

  return (
    <>
      <h1>Select topology for your system</h1>
      <div>{model.systemHeader}</div>
      {model.systems.map(renderSystemModel)}
    </>
  );
}

function renderSystemModel(model: SystemModel): React.ReactNode {
  return (
    <div key={model.kind}>
      <Schema model={model} viewOnly={true} />
      <h3>{model.title}</h3>
      <div>{model.description}</div>
      <NewSystemButton kind={model.kind} />{" "}
      <button className="btn btn-secondary">Help</button>
    </div>
  );
}

export function generateStaticParams(): { kind: string }[] {
  return applications.map((m) => {
    return { kind: m.name };
  });
}
