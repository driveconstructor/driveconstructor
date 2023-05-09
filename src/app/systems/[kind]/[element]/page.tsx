import PageTemplate from "@/app/PageTemplate";
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
    <PageTemplate title={model.title} text="">
      <Input params={params} />
    </PageTemplate>
  );
}

export function generateStaticParams(): Params[] {
  return getSystemKindsWithlements();
}
