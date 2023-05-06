import {
  SystemKind,
  getModel,
  getSystemKindsWithlements,
} from "@/model/system";
import dynamic from "next/dynamic";

const Input = dynamic(() => import("./Input"), { ssr: false });

export type Params = { kind: SystemKind; element: string };

export default function Page({ params }: { params: Params }) {
  const system = getModel(params.kind);

  return (
    <div>
      <h1>System</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos enim quo
        eius neque voluptatibus laboriosam perferendis quae odio non sed tempora
        recusandae soluta, nostrum reprehenderit aspernatur explicabo accusamus.
        Numquam, sint?
      </p>
      <div>Hello system!</div>
      <Input params={params} />
    </div>
  );
}

export function generateStaticParams(): Params[] {
  return getSystemKindsWithlements();
}
