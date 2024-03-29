"use client";
import { createSystem } from "@/model/store";
import { SystemKind, getModel } from "@/model/system";
import { useRouter } from "next/navigation";

export default function NewSystemButton({ kind }: { kind: SystemKind }) {
  const router = useRouter();

  return (
    <button
      className="btn"
      onClick={(e) => {
        const model = getModel(kind);
        const id = createSystem(model);
        router.push(`/systems/${kind}?id=${id}`);
      }}
    >
      New System
    </button>
  );
}
