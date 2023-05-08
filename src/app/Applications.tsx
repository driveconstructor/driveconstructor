import Image from "next/image";
import Link from "next/link";
import applications, { ApplicationModel } from "../model/application";

export default function Applications() {
  return (
    <div className="flex flex-wrap">
      {Object.values(applications).map(renderApp)}
    </div>
  );
}

function renderApp(model: ApplicationModel) {
  return (
    <div
      key={model.name}
      className="mx-2 basis-1/4 space-y-2 border border-gray-200 px-2 py-2"
    >
      <Image
        className="mx-auto"
        src={model.icon.src}
        alt={model.name}
        width={200}
        height={200}
      />
      <div className="text-xl">{model.title}</div>
      <div>{model.description}</div>
      <div className="flex justify-end space-x-1">
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
