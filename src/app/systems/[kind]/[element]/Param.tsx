import { useContext, useState } from "react";
import { SystemContext } from "./Input";
import ParamInput from "./ParamInput";
import ParamSelect from "./ParamSelect";

export type ChangeHandler = (v: string | number | null) => void;
export const ANY = "#any";

export default function Param({
  name,
  handleChange,
  resetErrors,
}: {
  name: string;
  handleChange: ChangeHandler;
  resetErrors: () => void;
}) {
  const context = useContext(SystemContext);

  const paramModel = context.model.input[context.element].params[name];
  const value = context.system.input[context.element][name] ?? "";

  const [inputValue, setInputValue] = useState(value);

  const setValue: ChangeHandler = (v) => {
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
    <ParamSelect
      id={name}
      value={inputValue}
      model={paramModel}
      onChange={(v) => {
        resetErrors();
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
        resetErrors();
        setInputValue(v);
      }}
      onCommit={setValue}
    />
  );

  return (
    <>
      <label className="justify-self-end text-sm" htmlFor={name}>
        {paramModel.label}:
      </label>
      {input}
    </>
  );
}
