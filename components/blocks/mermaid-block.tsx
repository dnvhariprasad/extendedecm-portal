"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
  theme: "base",
  themeVariables: {
    primaryColor: "#eef6f8",
    primaryTextColor: "#18202f",
    primaryBorderColor: "#176b87",
    lineColor: "#667085",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
});

export function MermaidBlock({ title, source }: { title: string; source: string }) {
  const id = useId().replaceAll(":", "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    mermaid
      .render(`mermaid-${id}`, source)
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      })
      .catch((renderError: unknown) => {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Unable to render diagram.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, source]);

  return (
    <section className="rounded-lg border border-[var(--border)] bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="m-0 text-lg font-semibold">{title}</h2>
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#667085]">Mermaid</span>
      </div>
      {error ? (
        <pre className="mt-4 overflow-x-auto rounded-md bg-[var(--danger-soft)] p-4 text-sm text-[#8a1f1f]">{error}</pre>
      ) : (
        <div className="mt-5 overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--primary)]">View source</summary>
        <pre className="mt-3 overflow-x-auto rounded-md bg-[#f2f4f7] p-4 text-xs leading-5 text-[#344054]">
          <code>{source}</code>
        </pre>
      </details>
    </section>
  );
}
