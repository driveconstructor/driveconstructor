import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";

import type { ReactNode } from "react";
import { baseOptions } from "./layout.config";
import { source } from "./source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <RootProvider>
        <DocsLayout tree={source.pageTree} {...baseOptions}>
          {children}
        </DocsLayout>
      </RootProvider>
    </div>
  );
}
