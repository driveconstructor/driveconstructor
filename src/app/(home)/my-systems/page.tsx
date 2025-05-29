import { Suspense } from "react";
import PageTemplate from "../PageTemplate";
import { MySystems } from "./MySystems";

export default function Page() {
  return (
    <PageTemplate>
      <Suspense>
        <MySystems />
      </Suspense>
    </PageTemplate>
  );
}
