"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import Element from "./Element";
import { SystemContext } from "./Input";

export default function ElementButton({ name }: { name: string }) {
  const context = useContext(SystemContext);
  const router = useRouter();

  const model = context.model.input[name];

  return (
    <Element
      icon={model.icon}
      width={model.iconWidth ?? 80}
      height={80}
      active={name == context.element}
      onClick={() =>
        router.push(`/systems/${context.model.kind}/${name}?id=${context.id}`)
      }
    />
  );
}
