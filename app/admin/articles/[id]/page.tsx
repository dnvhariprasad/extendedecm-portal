import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient, hasSupabaseBrowserEnv } from "@/lib/supabase/server";

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Edit Article",
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  if (!hasSupabaseBrowserEnv) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell userEmail={user.email}>
      <Card>
        <CardHeader>
          <CardTitle>Article editor coming next</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-[#667085]">
            Article <code>{id}</code> has been created. Metadata editing and block composition are handled in the next Jira stories.
          </p>
          <div className="mt-5">
            <Button asChild variant="secondary">
              <Link href="/admin/articles">Back to articles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
