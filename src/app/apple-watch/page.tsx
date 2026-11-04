import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HeartPulse, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";


interface PageProps {
  searchParams: Promise<{
    subcategoria?: string;
  }>;
}

export const metadata = {
  title: "Apple Watch Series 11, Ultra 3 e SE 3 | Mundo Apple Delivery",
  description: "Linha completa de Apple Watch Series 11, Ultra 3 de titânio e SE 3 novos lacrados com garantia oficial Apple.",
};

export default async function WatchCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params.subcategoria;

  let products = await getProducts({ category: "watch" });

  if (subcategoryFilter) {
    products = products.filter((p) =>
      p.subcategory?.toLowerCase().includes(subcategoryFilter.toLowerCase())
    );
  }

  const subcategories = [
    { label: "Todos os Watches", slug: "" },
    { label: "Series 12", slug: "Series 12" },
    { label: "Series 11", slug: "Series 11" },
    { label: "Ultra 4", slug: "Ultra 4" },
    { label: "Ultra 3", slug: "Ultra 3" },
    { label: "SE 3", slug: "SE 3" },
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

            const href = sub.slug ? `/apple-watch?subcategoria=${encodeURIComponent(sub.slug)}` : "/apple-watch";

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
