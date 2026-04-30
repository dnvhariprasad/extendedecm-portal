import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleMetadataForm } from "@/components/admin/article-metadata-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient, hasSupabaseBrowserEnv } from "@/lib/supabase/server";

export const metadata = {
  title: "New Article",
};

type ProductOptionRow = {
  id: string;
  name: string;
};

export default async function NewArticlePage() {
  if (!hasSupabaseBrowserEnv) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Supabase configuration required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#667085]">
              Add Supabase environment variables to enable article creation.
            </p>
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

  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .order("sort_order", { ascending: true })
    .returns<ProductOptionRow[]>();

  return (
    <AdminShell userEmail={user.email}>
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold">Create article</h2>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Start with metadata and draft status. Content blocks will be managed in the article editor.
        </p>
      </div>
      <Card className="mt-6 max-w-4xl">
        <CardHeader>
          <CardTitle>Article metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleMetadataForm mode="create" products={products ?? []} />
        </CardContent>
      </Card>
    </AdminShell>
  );
}
