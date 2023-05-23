import PageTemplate from "@/app/PageTemplate";
import { SystemKind, getModel, getSystemKinds } from "@/model/system";
import dynamic from "next/dynamic";

const Input = dynamic(() => import("./Input"), { ssr: false });

export default function Page({ params }: { params: { kind: SystemKind } }) {
  const model = getModel(params.kind);

  return (
    <PageTemplate title={model.title} text="">
      <Input kind={params.kind} />
    </PageTemplate>
  );
}

export function generateStaticParams(): { kind: SystemKind }[] {
  return getSystemKinds();
}
