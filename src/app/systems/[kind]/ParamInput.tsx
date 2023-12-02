import { SystemParam } from "@/model/system";
import { ChangeHandler } from "./Param";
import ParamRange from "./ParamRange";

export default function ParamInput({
  id,
  value,
  model,
  onChange,
  onCommit,
}: {
  id: string;
  value: any;
  model: SystemParam;
  onChange: ChangeHandler;
  onCommit: ChangeHandler;
}) {
  return (
    <>
      <input
        id={id}
        className={"border text-left" + (model.disabled ? " bg-gray-100" : "")}
        type={model.disabled ? "text" : model.type}
        min={model.range?.min}
        max={model.range?.max}
        value={model.precision ? value?.toFixed(model.precision) : value}
        onChange={(e) => {
          onChange(e.target.value);
          onCommit(e.target.value);
        }}
        disabled={model.disabled}
      ></input>
      {model.type == "number" && model.range != null ? (
        <ParamRange
          id={id}
          value={value}
          onChange={onChange}
          onCommit={onCommit}
          range={model.range}
        />
      ) : (
        <div></div>
      )}
    </>
  );
}
