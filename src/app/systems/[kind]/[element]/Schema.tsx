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
        <Element icon={v.icon} className="disabled el-icon-small" />
      ) : (
        <ElementButton name={k} />
      )}
    </div>
  ));

  return (
    <div className="btn-group btn-group-border" role="group">
      <div className="row" style={{ float: "none", margin: "0px auto" }}>
        {elements}
      </div>
    </div>
  );
}
