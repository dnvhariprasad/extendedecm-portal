import type { Article, ArticleType, ContentBlock } from "@/lib/content/types";
import { articles as sampleArticles } from "@/lib/content/sample-content";
import type { ArticleContentType, ArticleRow } from "@/lib/data/database-types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

const articleTypeLabels: Record<ArticleContentType, ArticleType> = {
  implementation_guide: "Implementation Guide",
  architecture_pattern: "Architecture Pattern",
  troubleshooting_note: "Troubleshooting Note",
  learning_note: "Learning Note",
  dql_snippet: "DQL Snippet",
};

function normalizeBlocks(blocks: unknown): ContentBlock[] {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks.filter((block): block is ContentBlock => {
    return Boolean(block && typeof block === "object" && "id" in block && "type" in block);
  });
}

function mapArticleRow(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    type: articleTypeLabels[row.content_type],
    featured: row.featured,
    blocks: normalizeBlocks(row.blocks),
  };
}

export async function listPublishedArticles(): Promise<Article[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return sampleArticles;
  }

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, product_id, category_id, slug, title, excerpt, content_type, status, blocks, featured, published_at, created_by, updated_by, created_at, updated_at",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .returns<ArticleRow[]>();

  if (error || !data?.length) {
    return sampleArticles;
  }

  return data.map(mapArticleRow);
}

export async function listFeaturedArticles(): Promise<Article[]> {
  const articles = await listPublishedArticles();
  return articles.filter((article) => article.featured);
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await listPublishedArticles();
  return articles.find((article) => article.slug === slug);
}
