import { ParamRangeProps } from "@/model/system";
import { useState } from "react";
import { ChangeHandler } from "./Param";

export default function Range({
  value,
  handler,
  range,
}: {
  value: any;
  handler: ChangeHandler;
  range: ParamRangeProps<number>;
}) {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="flex">
      <div className="mx-2 text-xs">{range.min}</div>
      <input
        className="min-w-0"
        min={range.min}
        max={range.max}
        step={range.step}
        type="range"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onMouseUp={() => handler(inputValue)}
      />
      <div className="mx-2 text-xs">{range.max}</div>
    </div>
  );
}
