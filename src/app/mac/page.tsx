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
  title: "MacBook Pro M5/M6, MacBook Air M5, iMac e Mac mini | Mundo Apple Delivery",
  description: "Linha completa de MacBook Pro, MacBook Air M5, iMac M4, Mac mini e Mac Studio novos lacrados com garantia oficial Apple.",
};

export default async function MacCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params?.subcategoria;

  let products = await getProducts({ category: "mac", condition: "new" });

  if (subcategoryFilter) {
    const q = subcategoryFilter.toLowerCase();
    products = products.filter((p) =>
      `${p.name} ${p.subcategory || ""}`.toLowerCase().includes(q)
    );
  }

  const subcategories = [
    { label: "Todos os Macs", slug: "" },
    { label: "MacBook Pro", slug: "MacBook Pro" },
    { label: "MacBook Air", slug: "MacBook Air" },
    { label: "MacBook Neo", slug: "MacBook Neo" },
    { label: "iMac 24\"", slug: "iMac" },
    { label: "Mac mini", slug: "Mac mini" },
    { label: "Mac Studio", slug: "Mac Studio" },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Linha Mac"
          title="MacBook Pro, Air, iMac & Mac mini"
          subtitle="Computadores Apple novos e lacrados de fábrica com 1 ano de garantia oficial."
        />

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {subcategories.map((sub) => {
            const isSelected =
              (!subcategoryFilter && sub.slug === "") ||
              (subcategoryFilter && subcategoryFilter === sub.slug);

            const href = sub.slug ? `/mac?subcategoria=${encodeURIComponent(sub.slug)}` : "/mac";

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
