import { useContext, useState } from "react";
import { SystemContext } from "./Input";
import ParamInput from "./ParamInput";
import ParamSelect from "./ParamSelect";

export type ChangeHandler = (v: string | number | null) => void;
export const ANY = "#any";

export default function Param({
  name,
  handleChange,
  setErrors,
}: {
  name: string;
  handleChange: ChangeHandler;
  setErrors: (errors: string[]) => void;
}) {
  const context = useContext(SystemContext);
  const element = context.system.element;

  const paramModel = context.model.input[element].params[name];
  const value = context.system.input[element][name] ?? "";

  const [inputValue, setInputValue] = useState(value);

  const setValue: ChangeHandler = (v) => {
    if (v == ANY) {
      handleChange(null);
    } else if (paramModel.type == "number") {
      if (v == "") {
        setErrors([`${paramModel.label}: Invalid value`]);
        return;
      }

      const num = Number(v);
      const range = paramModel.range;
      if (range != null && (range.min > num || range.max < num)) {
        setErrors([`${paramModel.label}: Value out of range`]);
        return;
      }

      handleChange(num);
    } else {
      handleChange(v);
    }
  };

  const input = paramModel.options ? (
    <ParamSelect
      id={name}
      value={inputValue}
      model={paramModel}
      onChange={(v) => {
        setErrors([]);
        setInputValue(v);
        setValue(v);
      }}
    />
  ) : (
    <ParamInput
      id={name}
      value={inputValue}
      model={paramModel}
      onChange={(v) => {
        setErrors([]);
        setInputValue(v);
      }}
      onCommit={setValue}
    />
  );

  return (
    <>
      <label
        className={
          "text-sm" +
          (typeof paramModel.value == "function" ? " text-gray-500" : "")
        }
        htmlFor={name}
      >
        {paramModel.label}:
      </label>
      {input}
    </>
  );
}
