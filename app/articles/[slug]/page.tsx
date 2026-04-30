import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { articles, getArticle } from "@/lib/content/sample-content";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  return {
    title: article?.title ?? "Article",
    description: article?.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">{article.type}</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight">{article.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[#667085]">{article.excerpt}</p>
      <div className="mt-10">
        <BlockRenderer blocks={article.blocks} />
      </div>
    </article>
  );
}
