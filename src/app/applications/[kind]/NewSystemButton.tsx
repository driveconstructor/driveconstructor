"use client";
import { createSystem } from "@/model/store";
import { SystemKind, getModel } from "@/model/system";
import { useRouter } from "next/navigation";

export default function NewSystemButton({ kind }: { kind: SystemKind }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={(e) => {
          const model = getModel(kind);
          const id = createSystem(model);
          router.push(
            `/systems/${kind}/${Object.keys(model.input)[0]}?id=${id}`
          );
        }}
      >
        New System
      </button>
    </>
  );
}
