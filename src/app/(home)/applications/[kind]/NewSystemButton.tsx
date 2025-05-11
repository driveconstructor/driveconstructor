"use client";
import { createSystem } from "@/model/store";
import { SystemKind, getModel } from "@/model/system";
import { useRouter } from "next/navigation";

export default function NewSystemButton({ kind }: { kind: SystemKind }) {
  const router = useRouter();

  return (
    <button
      className="btn"
      data-testid={kind}
      onClick={() => {
        const model = getModel(kind);
        const result = createSystem(model);
        router.push(`/systems/${kind}?id=${result.id}`);
      }}
    >
      New System
    </button>
  );
}
