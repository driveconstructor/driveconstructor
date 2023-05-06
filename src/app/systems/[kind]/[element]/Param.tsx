import { SystemParam } from "@/model/system";
import { useContext } from "react";
import { SystemContext } from "./Input";

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
  const value = context.system.input[context.element][name] || "";
  const handler: ChangeHandler = (v) =>
    handleChange(v == "" ? null : paramModel.type == "number" ? Number(v) : v);

  const input = paramModel.options
    ? renderSelect(value, paramModel, handler)
    : renderInput(value, paramModel, handler);

  return (
    <>
      <legend>{name}</legend>
      {input}
    </>
  );
}

function renderSelect(
  value: string | number,
  model: SystemParam,
  handleChange: ChangeHandler
) {
  return (
    <select value={value} onChange={(e) => handleChange(e.target.value)}>
      {model.options?.map((v, i) => (
        <option key={i} value={v || ""}>
          {v || "<any>"}
        </option>
      ))}
    </select>
  );
}

function renderInput(
  value: any,
  model: SystemParam,
  handleChange: ChangeHandler
) {
  return (
    <input
      type={model.type}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    ></input>
  );
}
