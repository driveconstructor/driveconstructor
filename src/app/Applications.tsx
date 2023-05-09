import Image from "next/image";
import Link from "next/link";
import applications, { ApplicationModel } from "../model/application";

export default function Applications() {
  return (
    <div className="grid gap-2 p-4 md:grid-cols-4">
      {Object.values(applications).map(renderApp)}
    </div>
  );
}

function renderApp(model: ApplicationModel) {
  return (
    <div key={model.name} className="border border-gray-200 p-2">
      <Image
        className="mx-auto"
        src={model.icon.src}
        alt={model.name}
        width={200}
        height={200}
      />
      <div className="text-xl">{model.title}</div>
      <div>{model.description}</div>
      <div className="m-4 flex justify-end space-x-1">
        <Link className="btn" href={`/applications/${model.name}`}>
          Select
        </Link>
        <Link className="btn" href={model.url}>
          Help
        </Link>
      </div>
    </div>
  );
}
