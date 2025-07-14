import type { InferPageType } from "fumadocs-core/source";
import { remarkInclude } from "fumadocs-mdx/config";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { source } from "../source";

const processor = remark()
  .use(remarkMdx)
  // needed for Fumadocs MDX
  .use(remarkInclude)
  .use(remarkGfm);

async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await processor.process({
    path: page.data._file.absolutePath,
    value: page.data.content,
  });

  console.log(`Converting MDX to test: ${page.url}`);

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description ?? ""}

${processed.value ?? ""}`;
}

// cached forever
export const revalidate = false;

function walk(urls: string[], children: any[]) {
  children.forEach((c) => {
    if (c.type == "page") {
      urls.push(c.url);
    } else if (c.type == "folder") {
      urls.push(c.index.url);
      walk(urls, c.children);
    }
  });
}

export async function GET() {
  const urls: string[] = [];
  walk(urls, source.getPageTree().children);

  const books = ["/docs/textbook", "/docs/exercises"];

  // make sure text book goes first
  urls.sort((a, b) => {
    const aBookIndex = books.findIndex((x) => a.startsWith(x));
    const bBookIndex = books.findIndex((x) => b.startsWith(x));

    return aBookIndex - bBookIndex;
  });

  // documentation preserving order
  const scan = source
    .getPages()
    .sort((a, b) => urls.indexOf(a.url) - urls.indexOf(b.url))
    .map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
