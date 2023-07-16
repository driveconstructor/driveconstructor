import { SystemModel } from "@/model/system";
import Element from "./Element";
import ElementButton from "./ElementButton";

export default function Schema({
  model,
  onSelect,
}: {
  model: SystemModel;
  onSelect?: (e: string) => void;
}) {
  const elements = Object.entries(model.input).map(([k, v]) =>
    onSelect ? (
      <ElementButton key={k} name={k} onSelect={onSelect} />
    ) : (
      <Element key={k} icon={v.icon} width={60} height={60} />
    ),
  );

  return (
    <div className="flex flex-row" role="group">
      {elements}
    </div>
  );
}
