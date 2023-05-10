import { useContext } from "react";
import { SystemContext } from "./Input";
import ParamInput from "./ParamInput";
import ParamSelect from "./ParamSelect";

export type ChangeHandler = (v: string | number | null) => void;
export const ANY = "#any";

export default function Param({
  name,
  handleChange,
}: {
  name: string;
  handleChange: ChangeHandler;
}) {
  const context = useContext(SystemContext);

  const paramModel = context.model.input[context.element].params[name];
  const value = context.system.input[context.element][name] ?? "";

  const handler: ChangeHandler = (v) => {
    if (v == ANY) {
      handleChange(null);
    } else if (paramModel.type == "number") {
      if (v == "") {
        // invalid value
        return;
      }

      const num = Number(v);
      const range = paramModel.range;
      if (range != null && (range.min > num || range.max < num)) {
        // out of range
        return;
      }

      handleChange(num);
    } else {
      handleChange(v);
    }
  };

  const input = paramModel.options ? (
    <ParamSelect value={value} model={paramModel} handler={handler} />
  ) : (
    <ParamInput value={value} model={paramModel} handler={handler} />
  );

  return (
    <>
      <label className="text-m justify-self-end">{paramModel.label}:</label>
      {input}
    </>
  );
}
