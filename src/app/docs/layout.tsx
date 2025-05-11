import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";

import "katex/dist/katex.css";
import type { ReactNode } from "react";
import { baseOptions } from "./layout.config";
import { source } from "./source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <RootProvider search={{ enabled: false }}>
        <DocsLayout
          tree={source.pageTree}
          sidebar={{
            tabs: [
              {
                title: "Text book",
                description: "Text book description",
                url: "/docs/textbook",
              },
              {
                title: "Exercises",
                description: "Exercises description",
                url: "/docs/exercises",
              },
            ],
          }}
          {...baseOptions}
        >
          {children}
        </DocsLayout>
      </RootProvider>
    </div>
  );
}
