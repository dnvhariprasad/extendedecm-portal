export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  focus_areas: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ArticleContentType =
  | "implementation_guide"
  | "architecture_pattern"
  | "troubleshooting_note"
  | "learning_note"
  | "dql_snippet";

export type ArticleStatus = "draft" | "published" | "archived";

export type ArticleRow = {
  id: string;
  product_id: string | null;
  category_id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
  blocks: unknown;
  featured: boolean;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};
