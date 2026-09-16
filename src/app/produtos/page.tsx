import { getProducts, getCategories } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import Link from "next/link";


interface PageProps {
  searchParams: Promise<{
    categoria?: string;
    condicao?: "new" | "used";
    q?: string;
  }>;
}

export const metadata = {
  title: "Catálogo de Produtos Apple Novos | Mundo Apple Delivery",
  description: "Explore nossa linha completa de iPhones, MacBooks, iPads, Apple Watches e AirPods novos lacrados com 1 ano de garantia oficial Apple.",
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryFilter = params.categoria;
  const conditionFilter = params.condicao;
  const searchQuery = params.q;

  const products = await getProducts({
    category: categoryFilter,
    condition: conditionFilter,
    searchQuery: searchQuery,
  });

  const categories = await getCategories();

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Catálogo Oficial"
          title="Produtos Apple Novos e Lacrados"
          subtitle="Aparelhos 100% originais com 1 ano de garantia oficial Apple e entrega rápida."
        />

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <Link
            href="/produtos"
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              !categoryFilter
                ? "bg-apple-dark text-white shadow"
                : "bg-white text-apple-dark border border-apple-border hover:bg-gray-100"
            }`}
          >
            Todos os Produtos
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produtos?categoria=${cat.slug}`}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat.slug
                  ? "bg-apple-dark text-white shadow"
                  : "bg-white text-apple-dark border border-apple-border hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
