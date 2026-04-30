import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductBySlug, listProducts } from "@/lib/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name ?? "Product",
    description: product?.summary,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_0.25fr]">
        <article>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Product</p>
          <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#667085]">{product.summary}</p>

          <section className="mt-10 grid gap-4 md:grid-cols-2">
            {product.focusAreas.map((area) => (
              <Card key={area}>
                <CardHeader>
                  <CardTitle>{area}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[#667085]">
                    Capture learnings, diagrams, implementation decisions, and troubleshooting notes for this area.
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        </article>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Portal status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[#667085]">
                This area is scaffolded. Add source-backed notes through the CMS once the admin editor is expanded.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
