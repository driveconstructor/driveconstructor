import PageTemplate from "@/app/(home)/PageTemplate";
import { SystemKind, getSystemKinds } from "@/model/system";
import { Suspense } from "react";
import Input from "./Input";

export default async function Page({
  params,
}: {
  params: Promise<{ kind: SystemKind }>;
}) {
  const kind = (await params).kind;

  return (
    <PageTemplate>
      <Suspense>
        <Input kind={kind} />
      </Suspense>
    </PageTemplate>
  );
}

export function generateStaticParams(): { kind: SystemKind }[] {
  return getSystemKinds();
}
