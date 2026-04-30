"use client";

import { useActionState, useMemo, useState } from "react";
import type { ArticleFormState } from "@/app/admin/articles/actions";
import { createArticle } from "@/app/admin/articles/actions";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slug";

type ProductOption = {
  id: string;
  name: string;
};

const contentTypeOptions = [
  { value: "learning_note", label: "Learning Note" },
  { value: "implementation_guide", label: "Implementation Guide" },
  { value: "architecture_pattern", label: "Architecture Pattern" },
  { value: "troubleshooting_note", label: "Troubleshooting Note" },
  { value: "dql_snippet", label: "DQL Snippet" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const initialState: ArticleFormState = {
  error: null,
};

export function ArticleMetadataForm({ products }: { products: ProductOption[] }) {
  const [state, formAction, isPending] = useActionState(createArticle, initialState);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const suggestedSlug = useMemo(() => slugify(title), [title]);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-[#344054]">Title</span>
        <input
          className="mt-1 h-11 w-full rounded-md border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--primary)]"
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!slug) {
              setSlug(slugify(event.target.value));
            }
          }}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#344054]">Slug</span>
        <input
          className="mt-1 h-11 w-full rounded-md border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--primary)]"
          name="slug"
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          placeholder={suggestedSlug}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#344054]">Excerpt</span>
        <textarea
          className="mt-1 min-h-28 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm leading-6 outline-none focus:border-[var(--primary)]"
          name="excerpt"
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-[#344054]">Product</span>
          <select
            className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--primary)]"
            name="productId"
          >
            <option value="">Unassigned</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#344054]">Content Type</span>
          <select
            className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--primary)]"
            name="contentType"
            defaultValue="learning_note"
          >
            {contentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#344054]">Status</span>
          <select
            className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--primary)]"
            name="status"
            defaultValue="draft"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.error ? <p className="rounded-md bg-[var(--danger-soft)] p-3 text-sm text-[#8a1f1f]">{state.error}</p> : null}

      <div className="flex justify-end">
        <Button disabled={isPending} type="submit">
          {isPending ? "Creating..." : "Create article"}
        </Button>
      </div>
    </form>
  );
}
