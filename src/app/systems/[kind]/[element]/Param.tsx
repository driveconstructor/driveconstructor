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
    <div className="flex flex-row">
      <label className="flex-1/2">{paramModel.label}:</label>
      <div className="flex-1/4">{input}</div>
    </div>
  );
}

function renderSelect(
  value: string | number,
  model: SystemParam,
  handleChange: ChangeHandler
) {
  return (
    <select
      className="border border-gray-300 bg-transparent"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    >
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
    <div className="flex">
      <input
        className="border border-gray-300"
        type={model.type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      ></input>
      {model.type == "number" ? renderRange(0, 200, value, handleChange) : null}
    </div>
  );
}

function renderRange(
  min: number,
  max: number,
  value: any,
  handleChange: ChangeHandler
) {
  return (
    <div className="mx-2">
      <span className="text-xs mx-2">{min}</span>
      <input        
        min={min}
        max={max}
        type="range"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      <span className="text-xs mx-2">{max}</span>
    </div>
  );
}
