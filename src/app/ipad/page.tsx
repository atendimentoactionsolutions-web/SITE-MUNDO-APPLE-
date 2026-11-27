import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    subcategoria?: string;
  }>;
}

export const metadata = {
  title: "iPad Pro M5, iPad Air M4, mini e iPad 11 | Mundo Apple Delivery",
  description: "Linha completa de iPad Pro M5 de 11\" e 13\", iPad Air M4, iPad mini 7 e iPad 11ª Geração novos lacrados com garantia Apple de 1 ano.",
};

export default async function IPadCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params?.subcategoria;

  let products = await getProducts({ category: "ipad", condition: "new" });

  if (subcategoryFilter) {
    const q = subcategoryFilter.toLowerCase();
    products = products.filter((p) =>
      `${p.name} ${p.subcategory || ""}`.toLowerCase().includes(q)
    );
  }

  const subcategories = [
    { label: "Todos os iPads", slug: "" },
    { label: "iPad Pro M5", slug: "iPad Pro M5" },
    { label: "iPad Air M4", slug: "iPad Air M4" },
    { label: "iPad mini 7", slug: "iPad mini 7" },
    { label: "iPad 11ª Geração", slug: "iPad 11" },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Tablets Apple"
          title="iPad Pro, Air, mini & 11ª Geração"
          subtitle="Desempenho portátil com chip Apple Silicon e 1 ano de garantia oficial."
        />

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {subcategories.map((sub) => {
            const isSelected =
              (!subcategoryFilter && sub.slug === "") ||
              (subcategoryFilter && subcategoryFilter === sub.slug);

            const href = sub.slug ? `/ipad?subcategoria=${encodeURIComponent(sub.slug)}` : "/ipad";

            return (
              <Link
                key={sub.label}
                href={href}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-apple-dark text-white shadow"
                    : "bg-white text-apple-dark border border-apple-border hover:bg-gray-100"
                }`}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
