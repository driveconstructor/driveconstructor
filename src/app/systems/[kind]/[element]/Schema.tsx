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
  const elements = Object.entries(model.input).map(([k, v]) => (
    <div key={k}>
      {viewOnly ? (
        <Element icon={v.icon} size={60} />
      ) : (
        <ElementButton name={k} />
      )}
    </div>
  ));

  return (
    <div className="flex flex-row" role="group">
      {elements}
    </div>
  );
}
