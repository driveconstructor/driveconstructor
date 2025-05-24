import { Suspense } from "react";
import PageTemplate from "../PageTemplate";
import { MySystems } from "./MySystems";

export default function Page() {
  return (
    <PageTemplate title="My systems">
      <Suspense>
        <MySystems />
      </Suspense>
    </PageTemplate>
  );
}
