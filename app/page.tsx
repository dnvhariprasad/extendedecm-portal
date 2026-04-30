import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, Bug, GitBranch, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listFeaturedArticles } from "@/lib/data/articles";
import { listProducts } from "@/lib/data/products";

const capabilityCards = [
  {
    title: "Product Notes",
    description: "Documentum, Captiva, Content Server, InfoArchive, xECM Engineering, VIM, and AppWorks.",
    icon: Boxes,
  },
  {
    title: "Architecture Patterns",
    description: "Reusable diagrams and integration models for project reference.",
    icon: Network,
  },
  {
    title: "Troubleshooting",
    description: "Error catalog entries with root cause, evidence, and resolution notes.",
    icon: Bug,
  },
  {
    title: "Learning Paths",
    description: "Structured learning tracks for onboarding and team enablement.",
    icon: GitBranch,
  },
];

export default async function Home() {
  const [featuredArticles, products] = await Promise.all([listFeaturedArticles(), listProducts()]);

  return (
    <div>
      <section className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
              Extended ECM Knowledge Portal
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#111827] md:text-6xl">
              Practical implementation knowledge for enterprise content platforms.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#475467]">
              A structured reference for learning, project delivery, diagrams, code snippets, and troubleshooting across the OpenText Extended ECM ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/products">
                  Browse products <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/articles/documentum-repository-basics">
                  Read sample guide <BookOpen size={18} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid content-start gap-4">
            {capabilityCards.map((item) => (
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Product Areas</h2>
            <p className="mt-2 text-[#667085]">Start with the core product map. Each area can grow into implementation guides and project references.</p>
          </div>
          <Link className="text-sm font-semibold text-[var(--primary)]" href="/products">
            View all products
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`}>
              <Card className="h-full transition hover:border-[var(--primary)] hover:shadow-sm">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[#667085]">{product.summary}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--panel)]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h2 className="text-2xl font-bold">Featured Notes</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <Card className="h-full transition hover:border-[var(--primary)] hover:shadow-sm">
                  <CardHeader>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">{article.type}</p>
                    <CardTitle>{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-[#667085]">{article.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
