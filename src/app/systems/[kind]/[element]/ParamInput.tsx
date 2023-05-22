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
        className="border text-right"
        type={model.type}
        min={model.range?.min}
        max={model.range?.max}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onCommit(e.target.value);
        }}
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
