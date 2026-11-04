import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Tablet, PenTool, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";


interface PageProps {
  searchParams: Promise<{
    subcategoria?: string;
  }>;
}

export const metadata = {
  title: "iPad Pro M5 e iPad 11 | Mundo Apple Delivery",
  description: "Linha completa de iPad Pro M5 de 11\" e 13\" e iPad 11ª Geração novos lacrados com garantia Apple de 1 ano.",
};

export default async function IPadCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params.subcategoria;

  let products = await getProducts({ category: "ipad" });

  if (subcategoryFilter) {
    products = products.filter((p) =>
      p.subcategory?.toLowerCase().includes(subcategoryFilter.toLowerCase())
    );
  }

  const subcategories = [
    { label: "Todos os iPads", slug: "" },
    { label: "iPad Pro M5", slug: "iPad Pro M5" },
    { label: "iPad Air M4", slug: "iPad Air" },
    { label: "iPad mini 7", slug: "iPad mini" },
    { label: "iPad 11ª Geração", slug: "iPad 11" },
  ];

  return (
    <div className="pt-20 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        

        

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
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
