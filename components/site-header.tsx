import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/articles/documentum-repository-basics", label: "Guides" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link className="flex items-center gap-2 font-bold text-[#111827]" href="/">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)] text-white">
            <BookOpen size={19} />
          </span>
          <span>ExtendedECM</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} className="text-sm font-medium text-[#475467] hover:text-[#111827]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Button variant="secondary" aria-label="Search">
          <Search size={17} />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </header>
  );
}
