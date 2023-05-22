import { SystemParam } from "@/model/system";
import { ANY, ChangeHandler } from "./Param";

export default function ParamSelect({
  id,
  value,
  model,
  onChange,
}: {
  id: string;
  value: string | number;
  model: SystemParam;
  onChange: ChangeHandler;
}) {
  return (
    <>
      <select
        id={id}
        className="border bg-transparent text-right"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {model.options?.map((v, i) => (
          <option key={i} value={v ?? ANY}>
            {(model.optionLabels ? model.optionLabels[i] : v) ?? "<any>"}
          </option>
        ))}
      </select>
      <div></div>
    </>
  );
}
