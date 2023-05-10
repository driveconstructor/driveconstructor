import { useContext } from "react";
import { SystemContext } from "./Input";
import ParamInput from "./ParamInput";
import ParamSelect from "./ParamSelect";

export type ChangeHandler = (v: string | number | null) => void;

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
    // TODO: validate
    handleChange(v == "" ? null : paramModel.type == "number" ? Number(v) : v);
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
