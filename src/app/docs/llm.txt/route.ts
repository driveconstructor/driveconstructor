import type { InferPageType } from "fumadocs-core/source";
import { source } from "../source";
import json from "./image-descriptions.json";

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${page.data.description ?? ""}

${describeImages(processed)}`;
}

const imageDescriptions: Record<
  string,
  { summary: string; description: string }
> = json;


function describeImages(markdownContent: string) {
  // TODO: use json with image description to replace <img> tags
  return markdownContent;
}

// cached forever
export const revalidate = false;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
