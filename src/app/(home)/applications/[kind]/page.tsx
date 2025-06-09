import PageTemplate from "@/app/(home)/PageTemplate";
import Schema from "@/app/(home)/systems/[kind]/Schema";
import applications from "@/model/application";
import { SystemModel } from "@/model/system";
import Link from "next/link";
import React from "react";
import NewSystemButton from "./NewSystemButton";

export default async function Page({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const kind = (await params).kind;
  const model = applications.find((a) => a.name == kind);
  if (model == null) {
    throw new Error(`${kind} is not found`);
  }

  return (
    <PageTemplate
      title="Select topology for your system"
      text={model.systemHeader}
    >
      <div className="grid gap-2 p-4 md:grid-cols-2 lg:grid-cols-4">
        {model.systems.map(renderSystemModel)}
      </div>
    </PageTemplate>
  );
}

function renderSystemModel(model: SystemModel): React.ReactNode {
  return (
    <div key={model.kind} className="flex flex-col border border-gray-200 p-2">
      <Schema model={model} />
      <h3 className="py-4 text-xl">{model.title}</h3>
      <div className="grow"></div>
      <div className="justify-end">{model.description}</div>
      <div className="flex justify-end space-x-1 self-end m-4">
        <NewSystemButton kind={model.kind} />
        <Link className="btn" href="/docs/textbook/systems/">
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
