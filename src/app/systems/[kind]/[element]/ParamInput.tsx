import { SystemParam } from "@/model/system";
import { ChangeHandler } from "./Param";
import ParamRange from "./ParamRange";

export default function ParamInput({
  value,
  model,
  handler,
}: {
  value: any;
  model: SystemParam;
  handler: ChangeHandler;
}) {
  return (
    <>
      <input
        className="border text-right"
        type={model.type}
        min={model.range?.min}
        max={model.range?.max}
        value={value}
        onChange={(e) => handler(e.target.value)}
      ></input>
      {model.type == "number" && model.range != null ? (
        <ParamRange value={value} handler={handler} range={model.range} />
      ) : (
        <div></div>
      )}
    </>
  );
}
