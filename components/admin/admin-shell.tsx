import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, Home, LogOut, Settings, Tags } from "lucide-react";
import { signOutAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/products", label: "Products", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail?: string | null;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">CMS</p>
          <h1 className="mt-2 text-3xl font-bold">Admin workspace</h1>
          {userEmail ? <p className="mt-2 text-sm text-[#667085]">Signed in as {userEmail}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/">View portal</Link>
          </Button>
          <form action={signOutAdmin}>
            <Button type="submit" variant="secondary">
              <LogOut size={17} />
              Sign out
            </Button>
          </form>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="grid gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                className="flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-[#475467] hover:bg-white hover:text-[#111827]"
                href={item.href}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
