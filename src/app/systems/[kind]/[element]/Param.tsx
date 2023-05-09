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
      <label className="text-m justify-self-end">{paramModel.label}:</label>
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
    <>
      <select
        className="border bg-transparent text-right"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        {model.options?.map((v, i) => (
          <option key={i} value={v || ""}>
            {v || "<any>"}
          </option>
        ))}
      </select>
      <div></div>
    </>
  );
}

function renderInput(
  value: any,
  model: SystemParam,
  handleChange: ChangeHandler
) {
  return (
    <>
      <input
        className="border text-right"
        type={model.type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      ></input>
      {model.type == "number" ? (
        renderRange(0, 200, value, handleChange)
      ) : (
        <div></div>
      )}
    </>
  );
}

function renderRange(
  min: number,
  max: number,
  value: any,
  handleChange: ChangeHandler
) {
  return (
    <div className="flex">
      <div className="mx-2 text-xs">{min}</div>
      <input
        className="min-w-0"
        min={min}
        max={max}
        type="range"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="mx-2 text-xs">{max}</div>
    </div>
  );
}
