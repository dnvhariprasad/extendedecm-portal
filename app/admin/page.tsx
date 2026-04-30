import { redirect } from "next/navigation";
import { FileText, Layers, ShieldCheck, Tags } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient, hasSupabaseBrowserEnv } from "@/lib/supabase/server";

const adminCards = [
  { title: "Articles", description: "Create implementation guides, learning notes, and troubleshooting content.", icon: FileText },
  { title: "Blocks", description: "Compose pages using portable structured content blocks.", icon: Layers },
  { title: "Products", description: "Manage Documentum, Captiva, Content Server, InfoArchive, VIM, and AppWorks areas.", icon: Tags },
  { title: "Security", description: "Admin access is protected by Supabase Auth and future role checks.", icon: ShieldCheck },
];

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  if (!hasSupabaseBrowserEnv) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Supabase configuration required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#667085]">
              Add Supabase environment variables to enable admin login and content editing.
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

  return (
    <AdminShell userEmail={user.email}>
      <div className="grid gap-4 md:grid-cols-2">
        {adminCards.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
                <item.icon size={20} />
              </div>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[#667085]">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
