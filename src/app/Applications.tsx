import Image from "next/image";
import applications, { ApplicationModel } from "../model/application";
import LinkButton from "./LinkButton";

export default function Applications() {
  return <>{Object.values(applications).map(renderApp)}</>;
}

function renderApp(model: ApplicationModel) {
  return (
    <div
      key={model.name}
      className="mx-2 basis-1/4 space-y-2 border border-gray-200 px-2"
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
        <LinkButton href={`/applications/${model.name}`}>Select</LinkButton>
        <LinkButton href={model.url}>Help</LinkButton>
      </div>
    </div>
  );
}
