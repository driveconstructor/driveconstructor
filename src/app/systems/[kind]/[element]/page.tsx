import {
  SystemKind,
  getModel,
  getSystemKindsWithlements,
} from "@/model/system";
import dynamic from "next/dynamic";

const Input = dynamic(() => import("./Input"), { ssr: false });

export type Params = { kind: SystemKind; element: string };

export default function Page({ params }: { params: Params }) {
  const model = getModel(params.kind);

  return (
    <div className="space-y-4">
      <div className="text-xl">{model.title}</div>
      <Input params={params} />
    </div>
  );
}

export function generateStaticParams(): Params[] {
  return getSystemKindsWithlements();
}
