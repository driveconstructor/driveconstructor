import Image from "next/image";
import Link from "next/link";
import applications, { ApplicationModel } from "../model/application";

export default function Applications() {
  return <>{Object.values(applications).map(renderApp)}</>;
}

function renderApp(model: ApplicationModel) {
  return (
    <div key={model.name}>
      <Image src={model.icon.src} alt={model.name} width={200} height={200} />
      <h3>{model.title}</h3>
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
