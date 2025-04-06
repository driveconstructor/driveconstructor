"use client";

import { useContext } from "react";
import Element from "./Element";
import { SystemContext } from "./Input";

export default function ElementButton({
  name,
  onSelect,
}: {
  name: string;
  onSelect: (s: string) => void;
}) {
  const context = useContext(SystemContext);

  const model = context.model.input[name];
  const dummy = Object.keys(model.params).length == 0;

  return (
    <Element
      name={name}
      icon={model.icon}
      width={model.iconWidth ?? 80}
      height={80}
      active={dummy ? undefined : name == context.system.element}
      onClick={dummy ? undefined : () => onSelect(name)}
    />
  );
}
