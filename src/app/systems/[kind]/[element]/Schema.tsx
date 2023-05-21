import { SystemModel } from "@/model/system";
import Element from "./Element";
import ElementButton from "./ElementButton";

export default function Schema({
  model,
  viewOnly = false,
}: {
  model: SystemModel;
  viewOnly?: boolean;
}) {
  const elements = Object.entries(model.input).map(([k, v]) =>
    viewOnly ? (
      <Element key={k} icon={v.icon} width={60} height={60} />
    ) : (
      <ElementButton key={k} name={k} />
    )
  );

  return (
    <div className="flex flex-row" role="group">
      {elements}
    </div>
  );
}
