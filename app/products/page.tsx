import Link from "next/link";
import { products } from "@/lib/content/sample-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Product Map</p>
        <h1 className="mt-3 text-4xl font-bold">Extended ECM ecosystem areas</h1>
        <p className="mt-4 text-lg leading-8 text-[#667085]">
          Each product area can contain implementation notes, diagrams, troubleshooting guides, and project references.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`}>
            <Card className="h-full transition hover:border-[var(--primary)] hover:shadow-sm">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-[#667085]">{product.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.focusAreas.map((area) => (
                    <span key={area} className="rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[#475467]">
                      {area}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
