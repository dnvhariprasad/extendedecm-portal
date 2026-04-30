import type { ContentBlock } from "@/lib/content/types";
import { MermaidBlock } from "@/components/blocks/mermaid-block";

const noteStyles: Record<string, string> = {
  info: "border-[var(--border)] bg-white",
  warning: "border-[#e8c35d] bg-[var(--warning-soft)]",
  success: "border-[#8cc99f] bg-[var(--success-soft)]",
  danger: "border-[#f0a0a0] bg-[var(--danger-soft)]",
};

export function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-content space-y-6">
      {blocks.map((block) => {
        if (block.type === "heading") {
          const HeadingTag = block.level === 2 ? "h2" : "h3";
          return <HeadingTag key={block.id}>{block.text}</HeadingTag>;
        }

        if (block.type === "rich-text") {
          return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.html }} />;
        }

        if (block.type === "note") {
          return (
            <section key={block.id} className={`rounded-lg border p-5 ${noteStyles[block.variant]}`}>
              <h2 className="m-0 text-base font-semibold">{block.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#475467]">{block.body}</p>
            </section>
          );
        }

        if (block.type === "code") {
          return (
            <figure key={block.id} className="overflow-hidden rounded-lg border border-[var(--border)] bg-[#101828]">
              <figcaption className="border-b border-white/10 px-4 py-2 text-xs font-medium text-[#d0d5dd]">
                {block.filename ?? block.language}
              </figcaption>
              <pre className="overflow-x-auto p-4 text-sm leading-6 text-[#f2f4f7]">
                <code>{block.code}</code>
              </pre>
            </figure>
          );
        }

        if (block.type === "mermaid") {
          return <MermaidBlock key={block.id} title={block.title} source={block.source} />;
        }

        if (block.type === "steps") {
          return (
            <section key={block.id} className="rounded-lg border border-[var(--border)] bg-white p-5">
              <h2 className="m-0 text-lg font-semibold">{block.title}</h2>
              <ol className="mt-4 space-y-3 pl-0">
                {block.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-[#475467]">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
