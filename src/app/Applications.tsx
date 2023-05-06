import Image from "next/image";
import Link from "next/link";
import applications, { ApplicationModel } from "../model/application";

export default function Applications() {
  return <>{Object.values(applications).map(renderApp)}</>;
}

function renderApp(model: ApplicationModel) {
  return (
    <div key={model.name} className="basis-1/4">
      <Image src={model.icon.src} alt={model.name} width={200} height={200} />
      <div className="text-lg font-bold">{model.title}</div>
      <div>{model.description}</div>
      <ul>
        <li>
          <Link href={`/applications/${model.name}`}>Select</Link>
        </li>
        <li>
          <Link href={model.url}>Help</Link>
        </li>
      </ul>
    </div>
  );
}
