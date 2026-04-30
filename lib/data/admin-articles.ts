import type { SupabaseClient } from "@supabase/supabase-js";
import type { ArticleContentType, ArticleStatus } from "@/lib/data/database-types";

export type AdminArticleListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentType: ArticleContentType;
  status: ArticleStatus;
  featured: boolean;
  productId: string | null;
  productName: string | null;
  updatedAt: string;
  publishedAt: string | null;
};

type AdminArticleRow = {
  id: string;
  product_id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
  featured: boolean;
  published_at: string | null;
  updated_at: string;
};

type ProductLookupRow = {
  id: string;
  name: string;
};

export type AdminArticleListResult =
  | {
      articles: AdminArticleListItem[];
      error: null;
    }
  | {
      articles: [];
      error: string;
    };

export async function listAdminArticles(supabase: SupabaseClient): Promise<AdminArticleListResult> {
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("id, product_id, slug, title, excerpt, content_type, status, featured, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .returns<AdminArticleRow[]>();

  if (articlesError) {
    return {
      articles: [],
      error: articlesError.message,
    };
  }

  const { data: products } = await supabase.from("products").select("id, name").returns<ProductLookupRow[]>();
  const productNames = new Map((products ?? []).map((product) => [product.id, product.name]));

  return {
    articles: (articles ?? []).map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      contentType: article.content_type,
      status: article.status,
      featured: article.featured,
      productId: article.product_id,
      productName: article.product_id ? productNames.get(article.product_id) ?? null : null,
      updatedAt: article.updated_at,
      publishedAt: article.published_at,
    })),
    error: null,
  };
}
