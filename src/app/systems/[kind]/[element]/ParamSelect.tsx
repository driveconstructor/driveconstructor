import { SystemParam } from "@/model/system";
import { ANY, ChangeHandler } from "./Param";

export default function ParamSelect({
  value,
  model,
  onChange,
}: {
  value: string | number;
  model: SystemParam;
  onChange: ChangeHandler;
}) {
  return (
    <>
      <select
        className="border bg-transparent text-right"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {model.options?.map((v, i) => (
          <option key={i} value={v ?? ANY}>
            {v ?? "<any>"}
          </option>
        ))}
      </select>
      <div></div>
    </>
  );
}
