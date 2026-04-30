import Link from "next/link";
import { redirect } from "next/navigation";
import { FilePlus2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAdminArticles } from "@/lib/data/admin-articles";
import { createSupabaseServerClient, hasSupabaseBrowserEnv } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Articles",
};

const statusStyles = {
  draft: "bg-[var(--warning-soft)] text-[#7a5200]",
  published: "bg-[var(--success-soft)] text-[#176437]",
  archived: "bg-[#eef2f6] text-[#475467]",
};

export default async function AdminArticlesPage() {
  if (!hasSupabaseBrowserEnv) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Supabase configuration required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#667085]">
              Add Supabase environment variables to enable admin article management.
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

  const { articles, error } = await listAdminArticles(supabase);

  return (
    <AdminShell userEmail={user.email}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Articles</h2>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Manage implementation guides, learning notes, architecture patterns, and troubleshooting content.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <FilePlus2 size={17} />
            New article
          </Link>
        </Button>
      </div>

      {error ? (
        <Card className="mt-6 border-[#e8c35d] bg-[var(--warning-soft)]">
          <CardHeader>
            <CardTitle>Article data is not ready</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#5f4300]">
              Supabase returned: {error}. Apply the database schema from <code>supabase/schema.sql</code> and confirm
              your user has an owner/editor profile.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!error && articles.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No articles yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#667085]">
              Create the first article after the article editor is available. Drafts and published content will appear here.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!error && articles.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
          <div className="grid min-w-[760px] grid-cols-[1fr_130px_150px_150px] gap-4 border-b border-[var(--border)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">
            <span>Title</span>
            <span>Status</span>
            <span>Product</span>
            <span>Updated</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {articles.map((article) => (
              <Link
                key={article.id}
                className="grid min-w-[760px] grid-cols-[1fr_130px_150px_150px] gap-4 px-4 py-4 transition hover:bg-[#f8fafc]"
                href={`/admin/articles/${article.id}`}
              >
                <span>
                  <span className="block font-semibold text-[#18202f]">{article.title}</span>
                  <span className="mt-1 block text-sm text-[#667085]">/{article.slug}</span>
                </span>
                <span>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[article.status]}`}>
                    {article.status}
                  </span>
                </span>
                <span className="text-sm text-[#475467]">{article.productName ?? "Unassigned"}</span>
                <span className="text-sm text-[#475467]">{new Date(article.updatedAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
