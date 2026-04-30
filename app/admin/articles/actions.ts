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
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const productId = String(formData.get("productId") ?? "").trim() || null;
  const contentType = String(formData.get("contentType") ?? "learning_note") as ArticleContentType;
  const status = String(formData.get("status") ?? "draft") as ArticleStatus;
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  if (!title) {
    return { error: "Title is required." };
  }

  if (!slug) {
    return { error: "Slug is required." };
  }

  if (!contentTypes.has(contentType)) {
    return { error: "Content type is invalid." };
  }

  if (!statuses.has(status)) {
    return { error: "Status is invalid." };
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
      product_id: productId,
      slug,
      title,
      excerpt,
      content_type: contentType,
      status,
      blocks: [],
      published_at: status === "published" ? new Date().toISOString() : null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) {
    if (error.code === "23505") {
      return { error: "An article with this slug already exists." };
    }

    return { error: error.message };
  }

  revalidatePath("/admin/articles");
  redirect(data ? `/admin/articles/${data.id}` : "/admin/articles");
}
