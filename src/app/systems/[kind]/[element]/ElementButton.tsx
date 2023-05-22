"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import Element from "./Element";
import { SystemContext } from "./Input";

export default function ElementButton({ name }: { name: string }) {
  const context = useContext(SystemContext);
  const router = useRouter();

  const model = context.model.input[name];
  const dummy = Object.keys(model.params).length == 0;

  return (
    <Element
      icon={model.icon}
      width={model.iconWidth ?? 80}
      height={80}
      active={dummy ? undefined : name == context.element}
      onClick={
        dummy
          ? undefined
          : () =>
              router.push(
                `/systems/${context.model.kind}/${name}?id=${context.id}`
              )
      }
    />
  );
}
