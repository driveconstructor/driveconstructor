"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import Element from "./Element";
import { SystemContext } from "./Input";

export default function ElementButton({ name }: { name: string }) {
  const context = useContext(SystemContext);
  const router = useRouter();

  return (
    <Element
      icon={context.model.input[name].icon}
      size={80}
      active={name == context.element}
      onClick={() =>
        router.push(`/systems/${context.model.kind}/${name}?id=${context.id}`)
      }
    />
  );
}
