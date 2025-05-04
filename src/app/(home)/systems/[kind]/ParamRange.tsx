import { ParamRangeProps } from "@/model/system";
import { useState } from "react";
import { ChangeHandler } from "./Param";

export default function Range({
  id,
  value,
  onChange,
  onCommit,
  range,
}: {
  id: string;
  value: any;
  onChange: ChangeHandler;
  onCommit: ChangeHandler;
  range: ParamRangeProps<number>;
}) {
  const [sliding, setSliding] = useState(false);

  return (
    <div className="flex">
      <div className="mx-2 text-xs">{range.min}</div>
      <input
        id={id}
        className="min-w-0"
        min={range.min}
        max={range.max}
        step={range.step}
        type="range"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (!sliding) {
            onCommit(e.target.value);
          }
        }}
        onMouseDown={() => setSliding(true)}
        onMouseUp={() => {
          setSliding(false);
          onCommit(value);
        }}
        onTouchStart={() => setSliding(true)}
        onTouchEnd={() => {
          setSliding(false);
          onCommit(value);
        }}
      />
      <div className="mx-2 text-xs">{range.max}</div>
    </div>
  );
}
