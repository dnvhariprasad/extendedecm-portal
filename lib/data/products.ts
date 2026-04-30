import type { Product } from "@/lib/content/types";
import { products as sampleProducts } from "@/lib/content/sample-content";
import type { ProductRow } from "@/lib/data/database-types";
import { createSupabasePublicClient } from "@/lib/supabase/public";

function mapProductRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    focusAreas: row.focus_areas ?? [],
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return sampleProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, summary, focus_areas, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .returns<ProductRow[]>();

  if (error || !data?.length) {
    return sampleProducts;
  }

  return data.map(mapProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await listProducts();
  return products.find((product) => product.slug === slug);
}
