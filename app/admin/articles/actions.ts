"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ArticleContentType, ArticleStatus } from "@/lib/data/database-types";
import { slugify } from "@/lib/slug";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ArticleFormState = {
  error: string | null;
};

const contentTypes = new Set<ArticleContentType>([
  "implementation_guide",
  "architecture_pattern",
  "troubleshooting_note",
  "learning_note",
  "dql_snippet",
]);

const statuses = new Set<ArticleStatus>(["draft", "published", "archived"]);

export async function createArticle(_previousState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const parsed = parseArticleForm(formData);

  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      product_id: parsed.productId,
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      content_type: parsed.contentType,
      status: parsed.status,
      blocks: [],
      published_at: parsed.status === "published" ? new Date().toISOString() : null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) {
    return { error: getMutationErrorMessage(error) };
  }

  revalidatePath("/admin/articles");
  redirect(data ? `/admin/articles/${data.id}` : "/admin/articles");
}

export async function updateArticle(_previousState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  const articleId = String(formData.get("articleId") ?? "").trim();
  const parsed = parseArticleForm(formData);

  if (!articleId) {
    return { error: "Article ID is required." };
  }

  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { error } = await supabase
    .from("articles")
    .update({
      product_id: parsed.productId,
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      content_type: parsed.contentType,
      status: parsed.status,
      published_at: parsed.status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
    })
    .eq("id", articleId);

  if (error) {
    return { error: getMutationErrorMessage(error) };
  }

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}`);
  redirect(`/admin/articles/${articleId}`);
}

function parseArticleForm(formData: FormData):
  | {
      ok: true;
      title: string;
      excerpt: string;
      slug: string;
      productId: string | null;
      contentType: ArticleContentType;
      status: ArticleStatus;
    }
  | {
      ok: false;
      error: string;
    } {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const productId = String(formData.get("productId") ?? "").trim() || null;
  const contentType = String(formData.get("contentType") ?? "learning_note") as ArticleContentType;
  const status = String(formData.get("status") ?? "draft") as ArticleStatus;
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  if (!title) {
    return { ok: false, error: "Title is required." };
  }

  if (!slug) {
    return { ok: false, error: "Slug is required." };
  }

  if (!contentTypes.has(contentType)) {
    return { ok: false, error: "Content type is invalid." };
  }

  if (!statuses.has(status)) {
    return { ok: false, error: "Status is invalid." };
  }

  return {
    ok: true,
    title,
    excerpt,
    slug,
    productId,
    contentType,
    status,
  };
}

function getMutationErrorMessage(error: { code?: string; message: string }) {
  if (error.code === "23505") {
    return "An article with this slug already exists.";
  }

  return error.message;
}
