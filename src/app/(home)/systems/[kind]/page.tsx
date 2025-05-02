import PageTemplate from "@/app/(home)/PageTemplate";
import { SystemKind, getModel, getSystemKinds } from "@/model/system";
import { Suspense } from "react";
import Input from "./Input";

export default async function Page({
  params,
}: {
  params: Promise<{ kind: SystemKind }>;
}) {
  const kind = (await params).kind;
  const model = getModel(kind);

  return (
    <PageTemplate title={model.title} text="">
      <Suspense>
        <Input kind={kind} />
      </Suspense>
    </PageTemplate>
  );
}

export function generateStaticParams(): { kind: SystemKind }[] {
  return getSystemKinds();
}
