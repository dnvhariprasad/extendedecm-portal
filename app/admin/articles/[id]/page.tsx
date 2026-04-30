import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleMetadataForm } from "@/components/admin/article-metadata-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ArticleContentType, ArticleStatus } from "@/lib/data/database-types";
import { createSupabaseServerClient, hasSupabaseBrowserEnv } from "@/lib/supabase/server";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

type ProductOptionRow = {
  id: string;
  name: string;
};

type EditableArticleRow = {
  id: string;
  product_id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  content_type: ArticleContentType;
  status: ArticleStatus;
};

export const metadata = {
  title: "Edit Article",
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  if (!hasSupabaseBrowserEnv) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Supabase configuration required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#667085]">Add Supabase environment variables to edit articles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [{ data: article, error }, { data: products }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, product_id, slug, title, excerpt, content_type, status")
      .eq("id", id)
      .single<EditableArticleRow>(),
    supabase.from("products").select("id, name").order("sort_order", { ascending: true }).returns<ProductOptionRow[]>(),
  ]);

  if (error || !article) {
    notFound();
  }

  return (
    <AdminShell userEmail={user.email}>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold">Edit article</h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Update article metadata. Block composition is handled in the next editor story.
        </p>
      </div>
      <Card className="mt-6 max-w-4xl">
        <CardHeader>
          <CardTitle>Article metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleMetadataForm
            initialValues={{
              id: article.id,
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              productId: article.product_id,
              contentType: article.content_type,
              status: article.status,
            }}
            mode="edit"
            products={products ?? []}
          />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
